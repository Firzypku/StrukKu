-- ==============================================================================
-- StrukKu Feedback and Testimonials Migration
-- File: supabase/migrations/004_feedback_and_testimonials.sql
-- Keterangan: Pembuatan tabel feedback (masukan pengguna) dan testimonials
-- dengan proteksi RLS dan kolom izin (consent & approval)
-- ==============================================================================

-- 1. Tabel Feedback (Masukan, Keluhan, Ide Fitur, Bug)
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'Keluhan' CHECK (type IN ('Keluhan', 'Ide Fitur', 'Bug / Error', 'Lainnya')),
  message TEXT NOT NULL,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback (user_id);

-- Aktifkan RLS pada feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS: Siapapun (authenticated maupun pengunjung yang belum login) boleh mengirim feedback
DROP POLICY IF EXISTS "feedback_insert_policy" ON public.feedback;
CREATE POLICY "feedback_insert_policy" ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Hanya service role / admin yang boleh membaca seluruh data feedback
DROP POLICY IF EXISTS "feedback_select_admin_policy" ON public.feedback;
CREATE POLICY "feedback_select_admin_policy" ON public.feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);


-- 2. Tabel Testimonials (Testimoni Asli dengan Izin & Kurasi)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN NOT NULL DEFAULT false,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_public ON public.testimonials (approved, consent);

-- Aktifkan RLS pada testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS: Publik hanya dapat membaca testimoni yang SUDAH disetujui (approved=true) dan berizin (consent=true)
DROP POLICY IF EXISTS "testimonials_public_select_policy" ON public.testimonials;
CREATE POLICY "testimonials_public_select_policy" ON public.testimonials
  FOR SELECT
  USING (approved = true AND consent = true);
