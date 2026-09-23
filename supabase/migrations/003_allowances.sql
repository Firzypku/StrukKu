-- ==============================================================================
-- StrukKu Allowances Table Migration
-- File: supabase/migrations/003_allowances.sql
-- Keterangan: Tabel allowances (uang saku per siklus) dengan RLS granular per user
-- Simpan data uang saku tersinkronisasi di cloud dan migrasi dari localStorage
-- ==============================================================================

-- 1. Buat tabel allowances jika belum ada
CREATE TABLE IF NOT EXISTS allowances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_amount NUMERIC NOT NULL DEFAULT 1500000 CHECK (monthly_amount >= 0),
  pay_day INTEGER NOT NULL DEFAULT 25 CHECK (pay_day >= 1 AND pay_day <= 31),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT allowances_user_id_unique UNIQUE (user_id)
);

-- 2. Buat indeks performa pada user_id
CREATE INDEX IF NOT EXISTS idx_allowances_user_id ON allowances (user_id);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE allowances ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan RLS (Hanya user pemilik data yang dapat mengakses)
-- SELECT Policy
DROP POLICY IF EXISTS "allowances_select_user_policy" ON allowances;
CREATE POLICY "allowances_select_user_policy" ON allowances
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT Policy
DROP POLICY IF EXISTS "allowances_insert_user_policy" ON allowances;
CREATE POLICY "allowances_insert_user_policy" ON allowances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE Policy
DROP POLICY IF EXISTS "allowances_update_user_policy" ON allowances;
CREATE POLICY "allowances_update_user_policy" ON allowances
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE Policy
DROP POLICY IF EXISTS "allowances_delete_user_policy" ON allowances;
CREATE POLICY "allowances_delete_user_policy" ON allowances
  FOR DELETE USING (auth.uid() = user_id);
