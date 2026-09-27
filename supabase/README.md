# Panduan Migrasi Database StrukKu (Supabase CLI)

Repositori ini menggunakan sistem migrasi berurutan (`supabase/migrations/`) agar struktur database antara lingkungan **Development** dan **Production** selalu sinkron, terdokumentasi, dan dapat direproduksi secara otomatis.

---

## 🗂️ Daftar Urutan File Migrasi

1. **`000_initial_schema.sql`**
   - Membuat skema tabel inti: `expenses`, `budgets`, dan `challenges_progress`.
   - Menyiapkan index relasional dasar pada `user_id` dan `date`.

2. **`001_security.sql`**
   - Membersihkan duplikasi data historis.
   - Menambahkan constraint integritas data (`UNIQUE`, `CHECK amount > 0`).
   - Mengaktifkan Row Level Security (RLS) serta mendefinisikan policies granular untuk `expenses`, `budgets`, dan `challenges_progress`.

3. **`002_storage.sql`**
   - Menambahkan kolom `image` pada tabel `expenses`.
   - Menginisialisasi storage bucket privat `receipts` dengan batas ukuran 10 MB dan validasi MIME type.
   - Mengonfigurasi storage RLS policy berbasis path folder pengguna (`receipts/{auth.uid()}/*`).

4. **`003_allowances.sql`**
   - Membuat tabel `allowances` untuk sinkronisasi siklus uang saku & jatah harian aman antar-perangkat.
   - Mengaktifkan RLS khusus untuk pemilik data akun.

5. **`004_feedback_and_testimonials.sql`**
   - Membuat tabel `feedback` (keluhan, bug, masukan) yang aman dengan hak insert publik/authenticated dan read-only admin.
   - Membuat tabel `testimonials` yang hanya mengekspos ulasan berizin (`approved = true AND consent = true`).

---

## 🚀 Cara Menjalankan Migrasi via Supabase CLI

### 1. Instalasi Supabase CLI
Jika belum terpasang di komputer Anda:
```bash
# macOS (via Homebrew)
brew install supabase/tap/supabase

# atau via npm (global / local devDependency)
npm install -g supabase
```

### 2. Login ke Akun Supabase
```bash
supabase login
```
Perintah ini akan membuka browser untuk mengautentikasi akun Supabase Anda dan membuat personal access token.

### 3. Hubungkan ke Proyek (Development atau Production)
Ambil **Project Reference ID** dari URL dashboard Supabase Anda (`https://supabase.com/dashboard/project/<PROJECT_REF>`).

```bash
# Hubungkan ke database Development:
supabase link --project-ref <DEV_PROJECT_REF>

# Atau hubungkan ke database Production:
supabase link --project-ref <PROD_PROJECT_REF>
```

### 4. Terapkan Semua Migrasi (`db push`)
Jalankan perintah berikut untuk mengeksekusi semua migrasi SQL yang belum diterapkan pada target database:
```bash
supabase db push
```
Supabase CLI akan secara otomatis melacak migrasi mana saja yang sudah dijalankan pada tabel internal `supabase_migrations.schema_migrations` sehingga tidak akan mengeksekusi migrasi yang sama dua kali.

### 5. Membuat File Migrasi Baru di Masa Depan
Jika ada penambahan tabel atau perubahan struktur baru:
```bash
supabase migration new nama_perubahan_fitur
```
File baru akan otomatis terbuat di folder `supabase/migrations/` dengan timestamp yang rapi. Tulis skrip DDL SQL di dalam file tersebut, lalu uji sebelum di-push.

---

> ⚠️ **Catatan Penting Keamanan Produksi:**
> - Kredensial koneksi langsung database (`SUPABASE_DB_URL` / connection string `postgresql://...`) bersifat **sangat rahasia**.
> - Jangan pernah menyimpan connection string langsung di dalam source code publik. Selalu gunakan **GitHub Secrets** atau environment hosting terenkripsi.
