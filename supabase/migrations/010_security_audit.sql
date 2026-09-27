-- ==============================================================================
-- StrukKu Security Audit & Universal RLS Enforcement
-- File: supabase/migrations/010_security_audit.sql
-- Keterangan: Audit keamanan menyeluruh, penjaminan RLS aktif pada SEMUA tabel
-- di schema public, penambahan tabel rate_limits, dan pengetatan izin database.
-- CATATAN: File SQL ini hanya ditulis untuk Supabase CLI, tidak dieksekusi langsung.
-- ==============================================================================

-- ==============================================================================
-- 1. PENEGAKAN ROW LEVEL SECURITY (RLS) OTOMATIS PADA SELURUH TABEL PUBLIC
-- ==============================================================================
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl.tablename);
        RAISE NOTICE 'RLS berhasil dipastikan aktif pada tabel: public.%', tbl.tablename;
    END LOOP;
END $$;


-- ==============================================================================
-- 2. TABEL RATE LIMITING (/api) SEBAGAI FALLBACK JIKA REDIS TIDAK TERHUBUNG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- user_id atau IP address klien
    route TEXT NOT NULL DEFAULT 'global',
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    window_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indeks performa untuk lookup cepat window rate limit aktif
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
    ON public.rate_limits (identifier, route, window_end);

-- Aktifkan RLS pada tabel rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS rate_limits: Hanya service_role yang dapat mengakses data teknis ini
DROP POLICY IF EXISTS "rate_limits_service_role_policy" ON public.rate_limits;
CREATE POLICY "rate_limits_service_role_policy" ON public.rate_limits
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


-- ==============================================================================
-- 3. AUDIT & HARDENING TABEL-TABEL PUBLIK EKSISTING
-- ==============================================================================

-- 3.1 Hardening tabel 'expenses'
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses FORCE ROW LEVEL SECURITY;

-- 3.2 Hardening tabel 'budgets'
ALTER TABLE IF EXISTS public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.budgets FORCE ROW LEVEL SECURITY;

-- 3.3 Hardening tabel 'challenges_progress'
ALTER TABLE IF EXISTS public.challenges_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.challenges_progress FORCE ROW LEVEL SECURITY;

-- 3.4 Hardening tabel 'allowances'
ALTER TABLE IF EXISTS public.allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.allowances FORCE ROW LEVEL SECURITY;

-- 3.5 Hardening tabel 'feedback'
ALTER TABLE IF EXISTS public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.feedback FORCE ROW LEVEL SECURITY;

-- Pastikan anon tidak bisa melakukan SELECT/UPDATE/DELETE pada feedback
REVOKE SELECT, UPDATE, DELETE ON public.feedback FROM anon;
GRANT INSERT ON public.feedback TO anon, authenticated;

-- 3.6 Hardening tabel 'testimonials'
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials FORCE ROW LEVEL SECURITY;

-- Hanya publikasikan testimoni yang sudah lulus verifikasi kurasi
REVOKE INSERT, UPDATE, DELETE ON public.testimonials FROM anon;


-- ==============================================================================
-- 4. PEMBERSIHAN OTOMATIS DATA RATE LIMIT KEDALUWARSA (FUNCTION & CRON/CALL)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.rate_limits
    WHERE window_end < now() - INTERVAL '1 hour';
END;
$$;
