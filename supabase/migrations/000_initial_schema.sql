-- ==============================================================================
-- StrukKu Baseline Initial Schema Migration
-- File: supabase/migrations/000_initial_schema.sql
-- Keterangan: Pembuatan tabel inti StrukKu (expenses, budgets, challenges_progress)
-- Idempotent: Aman dijalankan pada database baru ataupun existing
-- CATATAN: File SQL hanya ditulis untuk version control migrasi Supabase CLI
-- ==============================================================================

-- 1. Tabel Expenses (Catatan Pengeluaran Pengguna)
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL DEFAULT 'Lainnya',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indeks dasar untuk performa query transaksi per user berdasarkan tanggal
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses (date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses (user_id, date);

-- 2. Tabel Budgets (Limit Anggaran Bulanan Pengguna)
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_limit NUMERIC NOT NULL DEFAULT 0 CHECK (monthly_limit >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT budgets_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets (user_id);

-- 3. Tabel Challenges Progress (Progres Gamifikasi Tantangan Hemat)
CREATE TABLE IF NOT EXISTS public.challenges_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  progress NUMERIC NOT NULL DEFAULT 0 CHECK (progress >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT challenges_progress_user_challenge_unique UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges_progress (user_id);
