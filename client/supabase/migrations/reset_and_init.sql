-- =============================================================
-- DataFlow AI — QUICK RESET & SETUP
-- For local dev/reset. PRODUCTION: Use 001_schema.sql + 002_seed.sql
-- =============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drop everything (reverse dependency order)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.telemetry, public.recommendations, public.user_interactions, public.content;
DROP TABLE IF EXISTS public.material_progress;
DROP TABLE IF EXISTS public.student_progress;
DROP TABLE IF EXISTS public.quiz_attempts;
DROP TABLE IF EXISTS public.questions;
DROP TABLE IF EXISTS public.quizzes;
DROP TABLE IF EXISTS public.materials;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.profiles;

-- 2. FAST SETUP: Run main migrations instead
-- Copy-paste these into SQL Editor:
-- 1. Above script (001_schema.sql)
-- 2. Then 002_seed.sql
-- 3. Test: node server/scripts/smokeSupabase.js

-- VERIFY: All tables exist + RPC works
SELECT 'READY - Run 001_schema.sql then 002_seed.sql' AS status;

