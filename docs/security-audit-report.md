# Laporan Audit Keamanan Database StrukKu (Security Audit Report)

**Tanggal Audit:** 27 September 2026  
**Auditor:** Senior Infrastructure & Security Engineer StrukKu  
**Target:** Seluruh Tabel Skema `public` PostgreSQL Supabase & Objek Storage  

---

## 🛡️ Ringkasan Eksekutif

StrukKu sedang dipersiapkan menjadi platform finansial mahasiswa berbasis langganan komersial (paid application). Setiap kebocoran data pengeluaran, saldo, foto struk, atau identitas pengguna merupakan pelanggaran berat UU PDP No. 27 Tahun 2022.

Audit ini mengevaluasi seluruh tabel pada skema `public`, konfigurasi Row Level Security (RLS), izin peran database (`anon`, `authenticated`, `service_role`), serta mekanisme isolasi multi-tenant.

---

## 🔍 Temuan Audit: Tabel yang Sebelumnya Belum Aman atau Rentan

| Nama Tabel / Objek | Status Sebelum Audit | Tingkat Risiko | Celah Keamanan yang Ditemukan | Tindakan Mitigasi yang Diterapkan (`010_security_audit.sql`) |
| :--- | :---: | :---: | :--- | :--- |
| **`feedback`** | ⚠️ Rawan Kebocoran | **TINGGI** | Tabel dibuat untuk menampung keluhan dan nomor WA/email pengguna. Jika izin `SELECT` tidak dicabut dari role `anon`, penyerang bisa membaca seluruh keluhan dan kontak pengguna lain. | RLS ditegakkan wajib (`FORCE RLS`). Hak `SELECT`, `UPDATE`, `DELETE` dicabut dari `anon`. Hanya role `service_role` atau pemilik `auth.uid() = user_id` yang diizinkan membaca. |
| **`testimonials`** | 🟡 Potensi Manipulasi | **SEDANG** | Tabel belum memiliki batasan `INSERT` publik sehingga pihak luar dapat menyuntikkan ulasan palsu atau merusak tampilan halaman muka tanpa verifikasi. | Hak `INSERT`, `UPDATE`, `DELETE` dicabut dari `anon`. RLS hanya mengizinkan `SELECT` jika `approved = true AND consent = true`. |
| **`storage.objects` (Bucket `receipts`)** | ⚠️ Akses Folder Parsial | **TINGGI** | Folder avatar profil (`avatars/`) dan foto struk belanja berada di bucket yang sama. Jika ada pengguna yang mengunggah berkas tanpa prefix folder `{auth.uid()}`, berkas berpotensi diakses publik jika bucket tidak diatur `private`. | Bucket dipastikan berstatus `public = false`. RLS policy storage mengunci jalur baca, unggah, dan hapus hanya ke folder `(storage.foldername(name))[1] = auth.uid()::text`. |
| **Tabel Baru Tanpa RLS (Masa Depan)** | 🚨 Celah Eskalasi | **KRITIS** | Jika pengembang menambahkan tabel baru di schema `public` di masa depan dan lupa menyertakan perintah `ENABLE ROW LEVEL SECURITY`, Supabase default membuka akses tabel tersebut ke publik. | Dibuat blok PL/pgSQL otomatis di `010_security_audit.sql` yang melakukan iterasi dinamis pada seluruh `pg_tables` dan mengaktifkan RLS ke 100% tabel public. |
| **Endpoint Serverless `/api`** | ⚠️ Ancaman Brute-force & DoS | **TINGGI** | Belum ada mekanisme rate limiting per IP atau per pengguna, berisiko terhadap serangan spamming atau scraping biaya tinggi. | Menambahkan tabel `public.rate_limits` dengan RLS tertutup khusus `service_role` dan fungsi pembersihan otomatis `cleanup_expired_rate_limits()`. |

---

## 📋 Status RLS Setelah Audit

| Tabel | RLS Aktif? | Force RLS? | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `expenses` | ✅ Ya | ✅ Ya | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `budgets` | ✅ Ya | ✅ Ya | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `challenges_progress` | ✅ Ya | ✅ Ya | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `allowances` | ✅ Ya | ✅ Ya | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `feedback` | ✅ Ya | ✅ Ya | `auth.uid() = user_id` | `true` (Terbuka masukan) | Khusus Admin | Khusus Admin |
| `testimonials` | ✅ Ya | ✅ Ya | `approved AND consent` | Khusus Admin | Khusus Admin | Khusus Admin |
| `rate_limits` | ✅ Ya | ✅ Ya | Khusus `service_role` | Khusus `service_role` | Khusus `service_role` | Khusus `service_role` |

---

## 🔒 Rekomendasi Lanjutan untuk Tim Pengembang

1. **Jalankan Verifikasi Berkala**: Gunakan Supabase Linter atau jalankan query `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';` untuk memastikan nilai `rowsecurity` selalu `true`.
2. **Kunci Service Role**: Kunci `SUPABASE_SERVICE_ROLE_KEY` hanya boleh ada di environment backend Vercel Serverless Functions, **TIDAK PERNAH** dimasukkan ke kode client-side (frontend).
3. **Backup Terenkripsi**: Pastikan GitHub Action backup mingguan berjalan normal dan file terenkripsi tersimpan dengan aman.
