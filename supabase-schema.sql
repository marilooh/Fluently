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
-- the avatar locker, role-based display, and flashcard tracking.
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
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN  NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cards_studied      INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cards_mastered     INTEGER     NOT NULL DEFAULT 0;


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


-- ── Survey responses table ───────────────────────────────────
-- Run this in the Supabase SQL editor to create the table that
-- stores public survey submissions from /survey (no login needed).
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id                            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  email                         TEXT,
  role                          TEXT,
  spanish_interaction_frequency TEXT,
  used_prior_tool               BOOLEAN,
  prior_tool_issues             TEXT[]      NOT NULL DEFAULT '{}',
  desired_features              TEXT[]      NOT NULL DEFAULT '{}',
  teaching_problem              TEXT,       -- biggest problem with how medical Spanish is taught
  communication_barrier         TEXT,       -- ever felt unable to communicate with a patient
  commitment_scale              INTEGER     CHECK (commitment_scale BETWEEN 1 AND 5),
  would_pay                     TEXT        CHECK (would_pay IN ('yes', 'maybe', 'no')),
  price_range                   TEXT,
  referral_source               TEXT,
  additional_comments           TEXT,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If you already ran the previous schema (which had teaching_feedback / why_important),
-- run these to migrate to the new column names and add additional_comments:
-- ALTER TABLE public.survey_responses
--   RENAME COLUMN teaching_feedback TO teaching_problem;
-- ALTER TABLE public.survey_responses
--   RENAME COLUMN why_important TO communication_barrier;
-- ALTER TABLE public.survey_responses
--   ADD COLUMN IF NOT EXISTS additional_comments TEXT;

-- One response per user (prevents duplicate submissions).
CREATE UNIQUE INDEX IF NOT EXISTS survey_responses_user_id_key
  ON public.survey_responses(user_id)
  WHERE user_id IS NOT NULL;

-- Survey requires a logged-in account. Every response is linked to a user_id.
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own response
CREATE POLICY "Authenticated users can submit their own survey response"
  ON public.survey_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can read back their own response (for duplicate-submission check)
CREATE POLICY "Users can view their own survey response"
  ON public.survey_responses FOR SELECT
  USING (auth.uid() = user_id);


-- ── Auth: Email confirmation settings ────────────────────────
-- In your Supabase dashboard → Authentication → Email Templates,
-- set the Site URL to your Vercel deployment URL.
--
-- For local dev with auto-confirmation (no email required):
-- Authentication → Settings → toggle "Confirm email" off.
-- ─────────────────────────────────────────────────────────────
