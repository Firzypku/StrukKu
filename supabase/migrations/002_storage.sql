-- ==============================================================================
-- StrukKu Storage Migration
-- File: supabase/migrations/002_storage.sql
-- Keterangan: Pembuatan storage bucket 'receipts' (private) dan RLS policies
-- Dapat dijalankan di Supabase SQL Editor
-- ==============================================================================

-- 1. Tambah kolom image di tabel expenses jika belum ada
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS image TEXT;

-- 2. Buat bucket receipts (private) di storage.buckets jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- 3. Kebijakan Row Level Security (RLS) untuk storage.objects
-- Izinkan SELECT (baca) hanya file dalam folder milik user sendiri: receipts/{auth.uid()}/*
DROP POLICY IF EXISTS "receipts_select_user_policy" ON storage.objects;
CREATE POLICY "receipts_select_user_policy" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Izinkan INSERT (upload) hanya ke folder milik user sendiri: receipts/{auth.uid()}/*
DROP POLICY IF EXISTS "receipts_insert_user_policy" ON storage.objects;
CREATE POLICY "receipts_insert_user_policy" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Izinkan UPDATE hanya file dalam folder milik user sendiri
DROP POLICY IF EXISTS "receipts_update_user_policy" ON storage.objects;
CREATE POLICY "receipts_update_user_policy" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Izinkan DELETE hanya file dalam folder milik user sendiri
DROP POLICY IF EXISTS "receipts_delete_user_policy" ON storage.objects;
CREATE POLICY "receipts_delete_user_policy" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
