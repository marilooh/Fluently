-- ============================================================
-- Fluently — Supabase Database Schema
-- ============================================================
-- CURRENT STATE: The user_profiles table was created manually
-- with this minimal set of columns:
--   id, email, display_name, xp, coins, completed_lessons,
--   created_at, updated_at
--
-- ── STEP 1: Run this if you haven't yet ──────────────────────
-- RLS policies (required — run in Supabase SQL editor):
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── STEP 2: Add missing columns ──────────────────────────────
-- The app uses these columns for XP levels, streaks, hearts,
-- the avatar locker, and role-based display.
-- Run this block in the Supabase SQL editor to add them all.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role               TEXT        DEFAULT 'student'
                                              CHECK (role IN ('student','nurse','emt','doctor','premed','other')),
  ADD COLUMN IF NOT EXISTS institution        TEXT,
  ADD COLUMN IF NOT EXISTS level              INTEGER     NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS streak             INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date   DATE,
  ADD COLUMN IF NOT EXISTS hearts             INTEGER     NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS avatar_items       TEXT[]      NOT NULL DEFAULT ARRAY['scrubs_white','badge_basic'],
  ADD COLUMN IF NOT EXISTS equipped_items     TEXT[]      NOT NULL DEFAULT ARRAY['scrubs_white','badge_basic'],
  ADD COLUMN IF NOT EXISTS placement_level    TEXT        CHECK (placement_level IN ('beginner','intermediate','advanced')),
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN  NOT NULL DEFAULT FALSE;


-- ── STEP 3: Auto-update updated_at on any row change ─────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ── REFERENCE: Full intended schema ──────────────────────────
-- This is what user_profiles should look like once you've run
-- Steps 1-3 above.  Do NOT run this CREATE TABLE if the table
-- already exists — use the ALTER TABLE in Step 2 instead.
-- ─────────────────────────────────────────────────────────────
-- CREATE TABLE IF NOT EXISTS public.user_profiles (
--   id                   UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   email                TEXT,
--   display_name         TEXT        NOT NULL DEFAULT '',
--   xp                   INTEGER     NOT NULL DEFAULT 0,
--   coins                INTEGER     NOT NULL DEFAULT 100,
--   completed_lessons    TEXT[]      NOT NULL DEFAULT '{}',
--   created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   -- added by ALTER TABLE in Step 2:
--   role                 TEXT        DEFAULT 'student'
--                                    CHECK (role IN ('student','nurse','emt','doctor','premed','other')),
--   institution          TEXT,
--   level                INTEGER     NOT NULL DEFAULT 1,
--   streak               INTEGER     NOT NULL DEFAULT 0,
--   last_active_date     DATE,
--   hearts               INTEGER     NOT NULL DEFAULT 5,
--   avatar_items         TEXT[]      NOT NULL DEFAULT ARRAY['scrubs_white','badge_basic'],
--   equipped_items       TEXT[]      NOT NULL DEFAULT ARRAY['scrubs_white','badge_basic'],
--   placement_level      TEXT        CHECK (placement_level IN ('beginner','intermediate','advanced')),
--   onboarding_completed BOOLEAN     NOT NULL DEFAULT FALSE
-- );


-- ── Auth: Email confirmation settings ────────────────────────
-- In your Supabase dashboard → Authentication → Email Templates,
-- set the Site URL to your Vercel deployment URL.
--
-- For local dev with auto-confirmation (no email required):
-- Authentication → Settings → toggle "Confirm email" off.
-- ─────────────────────────────────────────────────────────────
