/**
 * test-supabase.js — Skrip uji konektivitas Supabase untuk lingkungan pengujian
 * Mengambil kredensial hanya dari environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: Variabel lingkungan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus di-set terlebih dahulu.");
  console.log("Contoh menjalankan: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node test-supabase.js");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("== Mulai Tes Koneksi Supabase ==");
  
  // 1. Cek koneksi dasar (tanpa auth)
  let { data: ping, error: pingErr } = await supabase.from('expenses').select('*').limit(1);
  if (pingErr) {
    console.log("Status query tabel expenses:", pingErr.message);
  } else {
    console.log("Koneksi tabel sukses.");
  }

  console.log("Selesai uji coba.");
}

test();
