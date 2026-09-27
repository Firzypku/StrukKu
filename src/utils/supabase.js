/**
 * supabase.js — Supabase Client Initializer
 * Mendukung multi-environment (development & production) secara dinamis
 * melalui VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn(
      '⚠️ [StrukKu] Kredensial Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) belum terpasang di .env.local.\n' +
      'Aplikasi akan berjalan dalam mode offline/mock placeholder.'
    );
  } else {
    console.error(
      '🚨 [StrukKu Prod] Konfigurasi environment Supabase belum di-set di hosting (Vercel).'
    );
  }
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
