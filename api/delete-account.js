/**
 * api/delete-account.js — Serverless Function Penghapusan Akun Permanen (UU PDP)
 * Menghapus seluruh data pribadi pengguna di tabel expenses, budgets, allowances,
 * challenges, feedback, berkas di Storage 'receipts', dan akun auth.users.
 */

import { createClient } from '@supabase/supabase-js';
import { applyRateLimit } from './_rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Gunakan POST.' });
  }

  // Terapkan rate limit ketat (5 request per menit untuk endpoint sensitif ini)
  const allowed = await applyRateLimit(req, res, { limit: 5, windowSeconds: 60 });
  if (!allowed) return;

  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token otentikasi tidak ditemukan.' });
  }

  const token = authHeader.slice(7);
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({
      error: 'Konfigurasi server belum lengkap (SUPABASE_SERVICE_ROLE_KEY belum di-set).',
    });
  }

  // 1. Verifikasi token pengguna via Supabase Client
  const userClient = createClient(supabaseUrl, anonKey || serviceRoleKey);
  const { data: { user }, error: authError } = await userClient.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Sesi kedaluwarsa atau token tidak valid.' });
  }

  const userId = user.id;

  // 2. Gunakan Admin Client dengan Hak Service Role
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 2.1 Hapus semua berkas gambar struk & avatar di bucket 'receipts'
    try {
      // Hapus file di folder receipts/{userId}/
      const { data: receiptFiles } = await adminClient.storage
        .from('receipts')
        .list(userId, { limit: 500 });

      if (receiptFiles && receiptFiles.length > 0) {
        const pathsToDelete = receiptFiles.map((f) => `${userId}/${f.name}`);
        await adminClient.storage.from('receipts').remove(pathsToDelete);
      }

      // Hapus file avatar di folder avatars/ yang memuat userId
      const { data: avatarFiles } = await adminClient.storage
        .from('receipts')
        .list('avatars', { limit: 500 });

      if (avatarFiles && avatarFiles.length > 0) {
        const userAvatars = avatarFiles
          .filter((f) => f.name.startsWith(userId))
          .map((f) => `avatars/${f.name}`);
        if (userAvatars.length > 0) {
          await adminClient.storage.from('receipts').remove(userAvatars);
        }
      }
    } catch (storageErr) {
      console.warn('Peringatan saat membersihkan storage pengguna:', storageErr.message);
    }

    // 2.2 Hapus data dari seluruh tabel relasional (CASCADE / Manual)
    await Promise.allSettled([
      adminClient.from('expenses').delete().eq('user_id', userId),
      adminClient.from('budgets').delete().eq('user_id', userId),
      adminClient.from('allowances').delete().eq('user_id', userId),
      adminClient.from('challenges_progress').delete().eq('user_id', userId),
      adminClient.from('feedback').delete().eq('user_id', userId),
    ]);

    // 2.3 Hapus entitas auth.users secara permanen
    const { error: deleteUserErr } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteUserErr) {
      throw deleteUserErr;
    }

    return res.status(200).json({
      success: true,
      message: 'Seluruh data akun dan berkas pribadi berhasil dihapus permanen sesuai hak UU PDP.',
    });
  } catch (err) {
    console.error('Gagal menghapus akun:', err);
    return res.status(500).json({
      error: 'Terjadi kegagalan sistem saat menghapus data akun: ' + err.message,
    });
  }
}
