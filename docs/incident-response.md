# Standard Operating Procedure (SOP) Penanganan Insiden Kebocoran Data Pribadi (Data Breach Incident Response)
**Aplikasi**: StrukKu (Proyek Finansial Pribadi & Mahasiswa)  
**Kepatuhan Regulasi**: Undang-Undang Republik Indonesia No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), khususnya Pasal 46.  
**Versi**: 1.0  
**Tanggal Berlaku**: September 2026  

---

## 1. Latar Belakang & Landasan Hukum

Berdasarkan **Pasal 46 ayat (1) dan (2) UU PDP No. 27 Tahun 2022**:
> *(1) Dalam hal terjadi kegagalan pelindungan Data Pribadi, Pengendali Data Pribadi wajib menyampaikan pemberitahuan secara tertulis dalam waktu paling lambat **3 x 24 (tiga kali dua puluh empat) jam** kepada:*  
> *a. Subjek Data Pribadi; dan*  
> *b. Lembaga Pelindungan Data Pribadi.*  
> *(2) Pemberitahuan tertulis sebagaimana dimaksud pada ayat (1) minimal memuat:*  
> *a. Data Pribadi yang terungkap;*  
> *b. Kapan dan bagaimana Data Pribadi terungkap; dan*  
> *c. Upaya penanganan dan pemulihan atas terungkapnya Data Pribadi oleh Pengendali Data Pribadi.*

Dokumen ini menjadi panduan operasional wajib bagi seluruh pengelola sistem StrukKu saat terdeteksi atau diduga terjadi kegagalan keamanan sistem yang berdampak pada kerahasiaan, integritas, atau ketersediaan data pribadi pengguna.

---

## 2. Struktur Tim Tanggap Insiden (Incident Response Team - IRT)

| Peran | Penanggung Jawab | Kontak Darurat | Tugas Utama |
| :--- | :--- | :--- | :--- |
| **Incident Commander (IC)** | Lead Engineer / Founder | `security@strukku.id` / `pribadi@firzy.dev` | Mengoordinasikan seluruh respon, menetapkan status insiden, dan otorisasi isolasi sistem. |
| **Technical & Forensics Lead** | Platform / Backend Engineer | On-call Dev Team | Menganalisis log (Supabase, Vercel, Sentry), menambal celah, rotasi kredensial. |
| **Communications & DPO Lead** | Data Protection Officer (DPO) | `dpo@strukku.id` | Menyusun notifikasi resmi kepada Subjek Data dan Lembaga Pengawas PDP dalam batas 3x24 jam. |

---

## 3. Klasifikasi Tingkat Keparahan Insiden (Severity Matrix)

| Level | Kategori | Kriteria Dampak | Waktu Respon Awal |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Kritis)** | Kebocoran Data Massal | Kredensial database bocor, data transaksi / email > 100 pengguna terekspos ke publik, atau unauthorized export skala besar. | **< 15 menit** |
| **SEV-2 (Tinggi)** | Akses Tidak Sah Terbatas | Celah RLS memungkinkan pengguna melihat data pengguna lain (IDOR) atau kebocoran bucket Storage privat. | **< 1 jam** |
| **SEV-3 (Sedang)** | Anomali / Percobaan Penyerangan | Lonjakan rate-limit ekstrim, brute force login terdeteksi, atau scraping publik tanpa data PII sensitif. | **< 4 jam** |
| **SEV-4 (Rendah)** | Kerentanan Teoretis | Laporan bug bounty tanpa bukti eksploitasi aktif, salah konfigurasi header HTTP non-kritis. | **< 24 jam** |

---

## 4. Alur 5 Tahap Penanganan Insiden (Incident Lifecycle)

```
[1. DETEKSI & TRIAGE] ──▶ [2. ISOLASI & CONTAINMENT] ──▶ [3. FORENSIK & ANALISIS]
                                                                     │
[5. PASCA-INSIDEN & AUDIT] ◀── [4. NOTIFIKASI RESMI 3x24 JAM (UU PDP)] ◀─┘
```

### Tahap 1: Deteksi dan Eskalasi (0 - 1 Jam)
1. **Sumber Deteksi**:
   - Anomali Sentry (spikes error autentikasi, database injection attempt).
   - Log Vercel Web Analytics / Upstash rate limiting alert.
   - Supabase Audit Log (lonjakan query tak wajar pada tabel `expenses` atau `profiles`).
   - Laporan pengguna melalui formulir masukan internal aplikasi.
2. Segera buat kanal koordinasi darurat (War Room) dan tetapkan **Incident Commander**.
3. Catat timestamp awal deteksi ke dalam *Incident Log Sheet*.

### Tahap 2: Isolasi dan Penghentian Celah (1 - 4 Jam)
Lakukan tindakan mitigasi segera untuk menghentikan kebocoran lebih lanjut tanpa menghancurkan bukti forensik:
1. **Rotasi Kredensial**:
   - Jika service role key terekspos: Regenerate `SUPABASE_SERVICE_ROLE_KEY` segera via Supabase Dashboard.
   - Rotasi database connection password (`SUPABASE_DB_URL`).
   - Revoke semua active tokens/JWT di Supabase Authentication jika token signing key terdampak.
2. **Isolasi Jaringan & Endpoint**:
   - Jika celah ada di serverless endpoint `/api/*`: Terapkan pemblokiran sementara melalui Vercel Edge Middleware / Firewall.
   - Jika celah pada RLS database: Ubah policy darurat menjadi `USING (false)` untuk tabel terdampak sementara patch disiapkan.
3. **Penyimpanan Snapshot**:
   - Ambil snapshot database dan simpan log mentah (Vercel runtime logs, PostgreSQL access logs) untuk bukti investigasi.

### Tahap 3: Investigasi Forensik dan Penilaian Dampak (4 - 24 Jam)
Identifikasi secara terukur:
1. **Apa yang terungkap**: Email, nama, nominal transaksi pengeluaran, foto struk di Supabase Storage?
2. **Siapa yang terdampak**: Buat daftar spesifik UUID user yang datanya sempat diakses.
3. **Vektor eksploitasi**: Celah SQLi, salah konfigurasi RLS, kebocoran API secret di repositori git, atau credential stuffing.
4. **Validasi Pemulihan**: Pastikan exploit tidak lagi dapat direproduksi di lingkungan staging/prod.

---

### Tahap 4: Notifikasi Wajib Maksimal 3 x 24 Jam (UU PDP Pasal 46)
> ⚠️ **DEADLINE HUKUM KETAT**: Notifikasi tertulis WAJIB dikirimkan maksimal 72 jam sejak insiden terkonfirmasi!

#### A. Notifikasi kepada Lembaga Pelindungan Data Pribadi
Kirimkan surat resmi melalui kanal pelaporan resmi kementerian/lembaga terkait dengan lampiran:
1. Ringkasan insiden, waktu kejadian, dan waktu terdeteksi.
2. Estimasi jumlah subjek data pribadi terdampak.
3. Rincian kategori data pribadi yang terungkap.
4. Langkah-langkah teknis penanganan dan isolasi yang telah dilakukan.
5. Rencana mitigasi jangka panjang dan kontak person DPO.

#### B. Notifikasi kepada Subjek Data Pribadi (Pengguna Terdampak)
Kirimkan email blast menggunakan template resmi berikut:

```markdown
Subjek: [PEMBERITAHUAN KEAMANAN RESMI] Pemberitahuan Insiden Pelindungan Data Pribadi StrukKu

Kepada Pengguna StrukKu yang Terhormat,

Kami berkomitmen penuh untuk menjaga transparansi dan privasi data Anda sesuai dengan ketentuan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).

Melalui pemberitahuan ini, kami menyampaikan bahwa pada tanggal [TANGGAL & WAKTU KEJADIAN], tim keamanan kami mendeteksi adanya [DESKRIPSI SINGKAT INSIDEN, cth: anomali akses pada serverless endpoint yang memungkinkan pihak luar mengakses sebagian data transaksi].

1. Data Apa Saja yang Terdampak?
Berdasarkan hasil investigasi forensik kami, data yang berpotensi terekspos adalah:
- [Cth: Alamat email dan nama akun]
- [Cth: Catatan nominal dan kategori pengeluaran]
PENTING: Kata sandi Anda tersimpan dalam bentuk terenkripsi satu arah (hash bcrypt) dan data kartu pembayaran TIDAK pernah disimpan di server kami.

2. Apa yang Telah Kami Lakukan?
Dalam kurun waktu kurang dari [JUMLAH JAM] jam setelah terdeteksi, tim teknis kami telah:
- Menutup celah akses dan memperketat Row Level Security (RLS) di database.
- Melakukan rotasi menyeluruh pada seluruh kunci API dan kredensial sistem.
- Melaporkan insiden ini secara resmi kepada otoritas pelindungan data pribadi.

3. Langkah yang Disarankan bagi Anda:
- Lakukan penggantian kata sandi akun StrukKu Anda demi kehati-hatian.
- Waspadai email atau pesan mencurigakan yang mengatasnamakan StrukKu (kami tidak pernah meminta kata sandi melalui pesan pribadi).

Kami memohon maaf yang sebesar-besarnya atas ketidaknyamanan ini. Tim kami terus meningkatkan standar keamanan infrastruktur agar insiden serupa tidak terulang kembali.

Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi kontak pelindungan data kami di dpo@strukku.id atau melalui formulir masukan dalam aplikasi.

Hormat kami,
Tim Pelindungan Data StrukKu
```

---

### Tahap 5: Pemulihan, Remidiasi & Post-Mortem (24 Jam - 7 Hari)
1. **Audit Menyeluruh**:
   - Jalankan `supabase/migrations/010_security_audit.sql` untuk memastikan tidak ada tabel atau bucket tanpa RLS.
   - Periksa secret scanner (GitHub Secret Scanning, GitGuardian) untuk memastikan tidak ada kunci tercommit.
2. **Penyusunan Blameless Post-Mortem**:
   - Dokumentasikan akar masalah (*Root Cause Analysis* dengan metode *5 Whys*).
   - Buat tiket perbaikan arsitektural (*action items* terukur dengan PIC dan tenggat waktu).
3. **Simulasi Berkala**:
   - Lakukan latihan *tabletop exercise* simulasi kebocoran data setiap 6 bulan sekali.

---

## 5. Ringkasan Hak Subjek Data Pasca Insiden
Setiap pengguna yang terdampak berhak untuk:
1. Meminta salinan lengkap data yang tersimpan pada akun mereka (**Fitur Ekspor JSON / Excel** di Profil).
2. Meminta penghapusan permanen seluruh akun dan berkas struk (**Fitur Hapus Akun Permanen** di Profil).
3. Mendapatkan klarifikasi tertulis mengenai status pengamanan data mereka.
