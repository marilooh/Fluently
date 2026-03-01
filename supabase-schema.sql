-- ============================================================
-- Fluently — Supabase Database Schema
-- Run this in your Supabase project's SQL editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- ── user_profiles ────────────────────────────────────────────
-- One row per authenticated user. Extends auth.users.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL DEFAULT '',
  role                TEXT        NOT NULL DEFAULT 'student'
                                  CHECK (role IN ('student','nurse','emt','doctor','premed','other')),
  institution         TEXT,
  xp                  INTEGER     NOT NULL DEFAULT 0,
  level               INTEGER     NOT NULL DEFAULT 1,
  streak              INTEGER     NOT NULL DEFAULT 0,
  last_active_date    DATE,
  coins               INTEGER     NOT NULL DEFAULT 100,
  hearts              INTEGER     NOT NULL DEFAULT 5,
  avatar_items        TEXT[]      NOT NULL DEFAULT ARRAY['scrubs_white','badge_basic'],
  equipped_items      TEXT[]      NOT NULL DEFAULT ARRAY['scrubs_white','badge_basic'],
  completed_lessons   TEXT[]      NOT NULL DEFAULT '{}',
  placement_level     TEXT        CHECK (placement_level IN ('beginner','intermediate','advanced')),
  onboarding_completed BOOLEAN    NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own profile
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

-- ── Supabase Auth: Email confirmation settings ────────────────
-- In your Supabase dashboard → Authentication → Email Templates,
-- ensure the Site URL is set to your Vercel deployment URL.
--
-- For local development with auto-confirmation (no email required),
-- go to Authentication → Settings → "Confirm email" and toggle it off.
-- ─────────────────────────────────────────────────────────────
