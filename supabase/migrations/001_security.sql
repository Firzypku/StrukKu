-- ==============================================================================
-- StrukKu Database Security & Integrity Migration
-- File: supabase/migrations/001_security.sql
-- Keterangan: Skrip migrasi keamanan RLS, validasi data, constraint & indeks
-- Dapat dijalankan ulang dengan aman (idempotent) di Supabase SQL Editor
-- ==============================================================================

-- ==============================================================================
-- 1. PEMBERSIHAN DATA DUPLIKAT SEBELUM CONSTRAINT
-- ==============================================================================

-- 1.1 Hapus duplikat pada tabel budgets, sisakan baris terbaru berdasarkan ctid
DELETE FROM budgets a
USING budgets b
WHERE a.user_id = b.user_id
  AND a.ctid < b.ctid;

-- 1.2 Hapus duplikat pada tabel challenges_progress, sisakan baris terbaru berdasarkan ctid
DELETE FROM challenges_progress a
USING challenges_progress b
WHERE a.user_id = b.user_id
  AND a.challenge_id = b.challenge_id
  AND a.ctid < b.ctid;


-- ==============================================================================
-- 2. CONSTRAINT UNIQUE & VALIDASI DATA
-- ==============================================================================

-- 2.1 Tambahkan UNIQUE constraint pada budgets(user_id) untuk mendukung upsert
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_user_id_key;
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_user_id_unique;
ALTER TABLE budgets ADD CONSTRAINT budgets_user_id_unique UNIQUE (user_id);

-- 2.2 Tambahkan UNIQUE constraint pada challenges_progress(user_id, challenge_id)
ALTER TABLE challenges_progress DROP CONSTRAINT IF EXISTS challenges_progress_user_id_challenge_id_key;
ALTER TABLE challenges_progress DROP CONSTRAINT IF EXISTS challenges_progress_user_challenge_unique;
ALTER TABLE challenges_progress ADD CONSTRAINT challenges_progress_user_challenge_unique UNIQUE (user_id, challenge_id);

-- 2.3 Tambahkan CHECK constraint pada expenses.amount > 0
-- Perbaiki data lama jika ada transaksi non-positif agar tidak memblokir constraint
UPDATE expenses SET amount = 1 WHERE amount <= 0 OR amount IS NULL;

ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_amount_positive;
ALTER TABLE expenses ADD CONSTRAINT expenses_amount_positive CHECK (amount > 0);


-- ==============================================================================
-- 3. INDEKS UNTUK PERFORMA QUERY
-- ==============================================================================

-- Index komposit untuk mempercepat filter transaksi bulanan/harian per pengguna
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses (user_id, date);


-- ==============================================================================
-- 4. AKTIVASI ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges_progress ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- 5. KEBIJAKAN KEAMANAN (POLICIES) UNTUK TABEL EXPENSES
-- ==============================================================================

-- SELECT Policy
DROP POLICY IF EXISTS "expenses_select_user_policy" ON expenses;
CREATE POLICY "expenses_select_user_policy" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT Policy
DROP POLICY IF EXISTS "expenses_insert_user_policy" ON expenses;
CREATE POLICY "expenses_insert_user_policy" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE Policy
DROP POLICY IF EXISTS "expenses_update_user_policy" ON expenses;
CREATE POLICY "expenses_update_user_policy" ON expenses
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE Policy
DROP POLICY IF EXISTS "expenses_delete_user_policy" ON expenses;
CREATE POLICY "expenses_delete_user_policy" ON expenses
  FOR DELETE USING (auth.uid() = user_id);


-- ==============================================================================
-- 6. KEBIJAKAN KEAMANAN (POLICIES) UNTUK TABEL BUDGETS
-- ==============================================================================

-- SELECT Policy
DROP POLICY IF EXISTS "budgets_select_user_policy" ON budgets;
CREATE POLICY "budgets_select_user_policy" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT Policy
DROP POLICY IF EXISTS "budgets_insert_user_policy" ON budgets;
CREATE POLICY "budgets_insert_user_policy" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE Policy
DROP POLICY IF EXISTS "budgets_update_user_policy" ON budgets;
CREATE POLICY "budgets_update_user_policy" ON budgets
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE Policy
DROP POLICY IF EXISTS "budgets_delete_user_policy" ON budgets;
CREATE POLICY "budgets_delete_user_policy" ON budgets
  FOR DELETE USING (auth.uid() = user_id);


-- ==============================================================================
-- 7. KEBIJAKAN KEAMANAN (POLICIES) UNTUK TABEL CHALLENGES_PROGRESS
-- ==============================================================================

-- SELECT Policy
DROP POLICY IF EXISTS "challenges_select_user_policy" ON challenges_progress;
CREATE POLICY "challenges_select_user_policy" ON challenges_progress
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT Policy
DROP POLICY IF EXISTS "challenges_insert_user_policy" ON challenges_progress;
CREATE POLICY "challenges_insert_user_policy" ON challenges_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE Policy
DROP POLICY IF EXISTS "challenges_update_user_policy" ON challenges_progress;
CREATE POLICY "challenges_update_user_policy" ON challenges_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE Policy
DROP POLICY IF EXISTS "challenges_delete_user_policy" ON challenges_progress;
CREATE POLICY "challenges_delete_user_policy" ON challenges_progress
  FOR DELETE USING (auth.uid() = user_id);
