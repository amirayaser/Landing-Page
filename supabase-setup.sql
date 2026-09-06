-- ============================================================
-- SJ ADV. — Supabase Full Setup (projects + auth + storage)
-- ------------------------------------------------------------
-- HOW TO RUN:
--   1. Open https://supabase.com/dashboard  → select your project
--   2. Left sidebar → "SQL Editor" → "New query"
--   3. Paste this ENTIRE file and click "Run".
--   4. Then create the admin user:
--      Authentication → Users → "Add user" → (email + password, auto-confirm)
--   5. Finally, add that user's ID to admin_users (see section 6 below).
--
-- This script is IDEMPOTENT-ish: safe pieces use IF NOT EXISTS /
-- DROP+CREATE so you can re-run it without breaking anything.
-- ============================================================


-- ============================================================
-- 1) PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  category    text NOT NULL,
  description text,
  image_url   text,
  project_url text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Index: the public site always lists projects ordered by newest first
CREATE INDEX IF NOT EXISTS projects_created_at_idx
  ON public.projects (created_at DESC);


-- ============================================================
-- 2) AUTOMATIC updated_at (PostgreSQL trigger)
--    updated_at is set to now() on every UPDATE — no JS needed.
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3) ADMIN USERS TABLE (authorization, not just authentication)
--    Authentication  = who can log in          (Supabase Auth)
--    Authorization   = who may manage projects (rows in admin_users)
--    A user who logs in but is NOT listed here gets read-only power.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Every logged-in user may check whether THEY are an admin (own row only)
DROP POLICY IF EXISTS "Admin users can read own row" ON public.admin_users;
CREATE POLICY "Admin users can read own row"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Helper: true when the current user is listed as an admin.
-- SECURITY DEFINER so the policies below can check admin_users
-- without exposing its contents to the public.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;


-- ============================================================
-- 4) ROW LEVEL SECURITY ON PROJECTS + POLICIES
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4a) Everyone (visitors included) may READ projects
DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
CREATE POLICY "Public can read projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4b) ONLY logged-in admins may INSERT
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 4c) ONLY logged-in admins may UPDATE
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4d) ONLY logged-in admins may DELETE
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 5) GRANTS (explicit table privileges)
-- ============================================================
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;

GRANT SELECT ON public.admin_users TO authenticated;


-- ============================================================
-- 6) ➕ ADD YOUR ADMIN USER  (DO THIS AFTER CREATING THE AUTH USER)
-- ------------------------------------------------------------
-- Step A: Supabase Dashboard → Authentication → Users → "Add user"
--         (enter email + password, tick "Auto Confirm User")
-- Step B: Copy the user's UID from the users list.
-- Step C: Replace the UUID below with that UID and run ONLY this line:
--
-- INSERT INTO public.admin_users (user_id) VALUES ('PASTE-USER-UID-HERE')
-- ON CONFLICT (user_id) DO NOTHING;
--
-- You can add more admins the same way. To list current admins:
-- SELECT * FROM public.admin_users;
-- ============================================================


-- ============================================================
-- 7) REALTIME — live INSERT / UPDATE / DELETE on the public site
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'projects' AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
END
$$;


-- ============================================================
-- 8) STORAGE — public "project-images" bucket + policies
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8a) Anyone may VIEW the images (needed to render thumbnails)
DROP POLICY IF EXISTS "Public can read project images" ON storage.objects;
CREATE POLICY "Public can read project images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

-- 8b) ONLY logged-in admins may UPLOAD
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
CREATE POLICY "Admins can upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

-- 8c) ONLY logged-in admins may REPLACE / EDIT image files
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
CREATE POLICY "Admins can update project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin());

-- 8d) ONLY logged-in admins may DELETE image files
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;
CREATE POLICY "Admins can delete project images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin());


-- ============================================================
-- DONE ✔
--   projects table + index          → section 1
--   automatic updated_at            → section 2
--   admin_users + is_admin()        → section 3
--   RLS + policies + grants         → sections 4-5
--   add your admin UID              → section 6  (⚠️ required!)
--   Realtime enabled                → section 7
--   storage bucket + policies       → section 8
-- ============================================================
