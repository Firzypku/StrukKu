/**
 * _rateLimit.js — Middleware Rate Limiting untuk Endpoint /api di Vercel Serverless
 * Mendukung Upstash Redis (Utama) dengan fallback otomatis ke Supabase Table `rate_limits`.
 * Standar: 30 request per menit per pengguna/IP.
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_LIMIT = 30; // 30 request
const DEFAULT_WINDOW_SECONDS = 60; // 1 menit

// In-memory cache darurat untuk development lokal
const memoryStore = new Map();

/**
 * Eksekusi rate limit berbasis Upstash Redis REST API
 */
async function checkUpstashRedis(identifier, limit, windowSeconds) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null; // Tidak terkonfigurasi, beralih ke fallback

  try {
    const key = `ratelimit:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
    
    // Gunakan pipeline INCR dan EXPIRE via REST
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, windowSeconds],
      ]),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const currentCount = data[0]?.result || 1;

    return {
      success: currentCount <= limit,
      remaining: Math.max(0, limit - currentCount),
      total: currentCount,
      resetSeconds: windowSeconds,
    };
  } catch (err) {
    console.warn('⚠️ Gagal terhubung ke Upstash Redis, beralih ke Supabase DB fallback:', err.message);
    return null;
  }
}

/**
 * Eksekusi rate limit berbasis Tabel Supabase (Fallback)
 */
async function checkSupabaseTable(identifier, limit, windowSeconds) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowSeconds * 1000);

    // Cari window aktif
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('id, request_count, window_end')
      .eq('identifier', identifier)
      .gt('window_end', now.toISOString())
      .order('window_end', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const nextCount = existing.request_count + 1;
      await supabase
        .from('rate_limits')
        .update({ request_count: nextCount })
        .eq('id', existing.id);

      const resetSec = Math.max(1, Math.ceil((new Date(existing.window_end) - now) / 1000));
      return {
        success: nextCount <= limit,
        remaining: Math.max(0, limit - nextCount),
        total: nextCount,
        resetSeconds: resetSec,
      };
    } else {
      // Buat window baru
      await supabase.from('rate_limits').insert({
        identifier,
        request_count: 1,
        window_start: now.toISOString(),
        window_end: windowEnd.toISOString(),
      });

      return {
        success: true,
        remaining: limit - 1,
        total: 1,
        resetSeconds: windowSeconds,
      };
    }
  } catch (err) {
    console.warn('⚠️ Gagal rate limit via Supabase:', err.message);
    return null;
  }
}

/**
 * Fallback lokal in-memory
 */
function checkMemoryStore(identifier, limit, windowSeconds) {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || entry.resetAt < now) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  entry.count += 1;
  const resetSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetSeconds: resetSec,
  };
}

/**
 * Middleware Rate Limiter untuk Handler Vercel Serverless
 * @param {Request} req
 * @param {Response} res
 * @param {Object} options
 * @returns {Promise<boolean>} - True jika request diizinkan, False jika ditolak (429)
 */
export async function applyRateLimit(req, res, options = {}) {
  const limit = options.limit || DEFAULT_LIMIT;
  const windowSeconds = options.windowSeconds || DEFAULT_WINDOW_SECONDS;

  // Identifikasi pengguna berdasarkan IP atau Bearer token
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown-client';
  const authHeader = req.headers['authorization'] || '';
  const identifier = authHeader.startsWith('Bearer ') ? `user:${authHeader.slice(7, 25)}` : `ip:${ip}`;

  // 1. Coba Upstash Redis
  let result = await checkUpstashRedis(identifier, limit, windowSeconds);

  // 2. Jika Redis tidak aktif, gunakan Supabase Database
  if (!result) {
    result = await checkSupabaseTable(identifier, limit, windowSeconds);
  }

  // 3. Jika Supabase juga tidak tersedia, gunakan in-memory fallback
  if (!result) {
    result = checkMemoryStore(identifier, limit, windowSeconds);
  }

  // Set HTTP RateLimit standard headers
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
  res.setHeader('X-RateLimit-Reset', result.resetSeconds.toString());

  if (!result.success) {
    res.setHeader('Retry-After', result.resetSeconds.toString());
    res.status(429).json({
      error: 'Terlalu banyak permintaan (Rate Limit Exceeded).',
      message: `Batas maksimal adalah ${limit} request per ${windowSeconds} detik. Silakan coba lagi dalam ${result.resetSeconds} detik.`,
      retryAfterSeconds: result.resetSeconds,
    });
    return false;
  }

  return true;
}
