# DataFlow AI Supabase Setup

## 🚀 Production Deploy (Recommended)

1. **Supabase Dashboard** → Your Project → **SQL Editor** → **New Query**
2. **Extensions**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```
3. **Schema** (`001_schema.sql`):
   - Copy entire contents → Run
4. **Seed** (`002_seed.sql`):
   - Copy entire contents → Run
5. **Regenerate Types** (VS Code terminal in `client/`):
   ```bash
   npx supabase gen types typescript \
     --project-id YOUR_PROJECT_ID \
     > src/lib/database.types.ts
   ```
   - Get PROJECT_ID: Dashboard → Settings → General

## 🧪 Test Setup

```bash
# From project root
cd server && node scripts/smokeSupabase.js
```
✅ All tables + RPC → **READY**

## 🔄 Quick Local Reset

Run `reset_and_init.sql` (drops + guides to main flow).

## 📋 Schema Overview

| Feature | Tables |
|---------|--------|
| Auth | `profiles` (RLS + auto-trigger) |
| Courses | `courses`, `materials` |
| Quizzes | `quizzes`, `questions`, `quiz_attempts` |
| Progress | `student_progress`, `material_progress` |
| Analytics | `telemetry` (indexed) |
| AI Recs | `content`, `user_interactions`, `recommendations` |

**Realtime**: Progress/quiz/telemetry auto-subscribe in UI.

## .env Vars

**Client** (`.env.local`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Server** (`server/.env`):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Admin bypass RLS
```

## Next Steps After Deploy

1. Create admin user (email contains 'admin')
2. `npm run dev` (client) + `node server/server.js`
3. Test course list, progress tracking, quizzes
4. AI recs: Ensure `ai-service/` running at `AI_SERVICE_URL`

**Schema Changes?** → Update 001.sql → Regenerate types → Reseed.

All set! 🎉

