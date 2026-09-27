/**
 * api/health.js — Serverless Health & Rate Limiting Check Endpoint
 * Mendemonstrasikan proteksi rate limit 30 req/menit per user/IP.
 */

import { applyRateLimit } from './_rateLimit.js';

export default async function handler(req, res) {
  // Terapkan rate limit (30 request per menit)
  const allowed = await applyRateLimit(req, res, { limit: 30, windowSeconds: 60 });
  if (!allowed) return;

  res.status(200).json({
    status: 'ok',
    service: 'StrukKu API Gateway',
    timestamp: new Date().toISOString(),
    rateLimiting: 'active (30 req/min)',
  });
}
