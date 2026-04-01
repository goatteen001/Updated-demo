-- ============================================================
-- Course Progress Tracking System — Database Schema
-- Run this against your Supabase project (SQL Editor)
-- ============================================================

-- 1. user_material_progress — tracks per-user, per-material completion
CREATE TABLE IF NOT EXISTS user_material_progress (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  completed   BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, material_id)
);

-- 2. user_course_progress — aggregate course-level progress
CREATE TABLE IF NOT EXISTS user_course_progress (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id           UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress            FLOAT DEFAULT 0,            -- percentage 0-100
  completed_materials INT DEFAULT 0,
  total_materials     INT DEFAULT 0,
  last_updated        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, course_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_ump_user     ON user_material_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ump_material ON user_material_progress(material_id);
CREATE INDEX IF NOT EXISTS idx_ucp_user     ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ucp_course   ON user_course_progress(course_id);

-- Enable RLS (adjust policies to your auth setup)
ALTER TABLE user_material_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress   ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write their own rows
CREATE POLICY "Users manage own material progress"
  ON user_material_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own course progress"
  ON user_course_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role full access (backend uses service role key)
CREATE POLICY "Service role full access material progress"
  ON user_material_progress FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access course progress"
  ON user_course_progress FOR ALL
  USING (true)
  WITH CHECK (true);
