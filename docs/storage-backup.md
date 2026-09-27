# Panduan Backup & Disaster Recovery Storage Bucket StrukKu

Dokumen ini menjelaskan prosedur pencadangan (backup) dan pemulihan (restore) berkas gambar struk serta avatar yang tersimpan di dalam bucket privat `receipts` Supabase Storage.

---

## 🗄️ Arsitektur Penyimpanan StrukKu

Berkas gambar pada StrukKu dikelompokkan dalam bucket privat `receipts` dengan struktur folder terisolasi per pengguna:
- Struk belanja: `receipts/{auth.uid()}/{timestamp}.jpg`
- Foto profil: `receipts/avatars/{auth.uid()}-{timestamp}.jpg`

Karena `pg_dump` hanya mencadangkan metadata tabel PostgreSQL dan bukan objek biner (blob) file di storage, pencadangan bucket storage dilakukan secara terpisah melalui salah satu metode di bawah ini.

---

## 🛠️ Metode 1: Backup via Supabase S3-Compatible API (Rekomendasi untuk Produksi)

Supabase menyediakan endpoint S3-Compatible yang memungkinkan sinkronisasi langsung menggunakan alat standar seperti **AWS CLI** atau **rclone**.

### 1. Dapatkan Kredensial S3 dari Dashboard Supabase
1. Masuk ke **Supabase Dashboard** > **Project Settings** > **Storage**.
2. Salin:
   - **Endpoint URL**: `https://<PROJECT_REF>.supabase.co/storage/v1/s3`
   - **Access Key ID**
   - **Secret Access Key**
   - **Region**: `ap-southeast-1` (atau region cluster Anda)

### 2. Konfigurasi AWS CLI
```bash
aws configure --profile supabase
# Masukkan Access Key ID & Secret Access Key dari langkah di atas
```

### 3. Jalankan Sinkronisasi (Backup) ke Drive Lokal / Cloud Storage Lain
```bash
# Sinkronkan seluruh bucket 'receipts' ke direktori lokal:
aws s3 sync s3://receipts ./backup-storage-receipts \
  --endpoint-url https://<PROJECT_REF>.supabase.co/storage/v1/s3 \
  --profile supabase
```

### 4. Otomatisasi Mingguan ke Cloudflare R2 / AWS S3
Anda dapat membuat GitHub Action atau Cron Job di server untuk menjalankan:
```bash
aws s3 sync \
  --endpoint-url https://<PROJECT_REF>.supabase.co/storage/v1/s3 \
  s3://receipts s3://strukku-backup-r2/receipts
```

---

## 💻 Metode 2: Skrip Node.js (Menggunakan Supabase Service Role)

Jika tidak ingin menggunakan S3 API, Anda dapat menjalankan skrip utilitas Node.js menggunakan Kunci `SUPABASE_SERVICE_ROLE_KEY`:

```javascript
// scripts/backup-storage.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function downloadBucket(folder = '') {
  const { data: files, error } = await supabase.storage
    .from('receipts')
    .list(folder, { limit: 1000 });

  if (error) throw error;

  for (const file of files) {
    const fullPath = folder ? `${folder}/${file.name}` : file.name;
    if (file.id === null) {
      // Direktori/subfolder: panggil rekursif
      await downloadBucket(fullPath);
    } else {
      // Unduh file biner
      const { data, error: dlErr } = await supabase.storage
        .from('receipts')
        .download(fullPath);
      
      if (!dlErr) {
        const localPath = path.join('./storage-backup', fullPath);
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        fs.writeFileSync(localPath, Buffer.from(await data.arrayBuffer()));
        console.log(`✓ Tersimpan: ${fullPath}`);
      }
    }
  }
}

downloadBucket().catch(console.error);
```

Jalankan dengan:
```bash
SUPABASE_URL="https://xxx.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="ey..." \
node scripts/backup-storage.js
```

---

## 🔓 Prosedur Pemulihan (Restoration / Disaster Recovery)

### 1. Dekripsi Berkas Backup Database (.sql.enc)
Jika Anda mengunduh artefak database dari GitHub Actions:
```bash
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 \
  -in strukku-backup-YYYYMMDD.sql.enc \
  -out strukku-backup-restore.sql \
  -pass pass:KUNCI_ENKRIPSI_ANDA
```

### 2. Restore Database ke Supabase Baru
```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres" < strukku-backup-restore.sql
```

### 3. Restore Berkas Storage
```bash
aws s3 sync ./backup-storage-receipts s3://receipts \
  --endpoint-url https://<NEW_PROJECT_REF>.supabase.co/storage/v1/s3 \
  --profile supabase
```

---
*Dokumen ini dikelola oleh Tim Engineering StrukKu. Periksa integritas backup berkala setiap akhir bulan.*
