import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lrehoqryqqolrhkxbkxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZWhvcXJ5cXFvbHJoa3hia3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDc4MDQsImV4cCI6MjA5MTMyMzgwNH0.sG8rE8NLDga8MjSSTPyNibBEeE14ptTj5CjvL0DMetQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("== Mulai Tes Koneksi Supabase ==");
  
  // 1. Cek koneksi dasar (tanpa auth)
  let { data: ping, error: pingErr } = await supabase.from('expenses').select('*').limit(1);
  if (pingErr) {
    console.log("Gagal menghubungi tabel expenses (wajar jika RLS jalan):", pingErr.message);
  } else {
    console.log("Koneksi tabel sukses.");
  }

  // 2. Coba daftar / sing-in user dummy untuk test
  const email = "test_robot_fzr@gmail.com";
  const password = "password123";

  let { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password
  });

  if (authErr) {
    if (authErr.message.includes('already registered')) {
        let { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) {
           console.log("Gagal login:", loginErr);
           return;
        }
        console.log("Berhasil login dgn user tes:", loginData.user.id);
    } else {
        console.log("Register error:", authErr);
        return;
    }
  } else {
    console.log("Berhasil register user tes:", authData.user.id);
  }

  // 3. Coba Insert data
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
     console.log("UserId kosong");
     return;
  }

  console.log("Mencoba simpan data..");
  const doc = {
    user_id: userId,
    title: "Test Insert",
    amount: 15000,
    category: "Makanan"
  };

  const { data: insData, error: insErr } = await supabase.from('expenses').insert([doc]).select();
  if (insErr) {
     console.log("GAGAL INSERT DATA!!!!", insErr);
  } else {
     console.log("BERHASIL INSERT DATA:", insData);
  }

  // 4. Try select
  const { data: selData, error: selErr } = await supabase.from('expenses').select('*');
  if (selErr) {
     console.log("GAGAL SELECT", selErr);
  } else {
     console.log("Banyaknya data user ini:", selData.length);
  }

  console.log("Selesai");
}

test();
