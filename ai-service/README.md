# AI Service (Recommendation Backend)

FastAPI service for personalized content recommendations.

## 🚀 Start

**Prerequisites**: Python 3.10+, Supabase `.env`

```bash
cd ai-service

# Virtual env (recommended)
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Install deps
pip install -r requirements.txt

# Start dev server
uvicorn main:app --reload --port 8000
```

**Production**:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

✅ Server: `http://localhost:8000` → `{"message": "AI Service Connected to Supabase 🚀"}`

## .env (copy from root or create)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Usage

**POST /recommend** (used by `server/services/recommendationService.js`):
```bash
curl -X POST "http://localhost:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid-here"}'
```

Returns: `[{"user_id": "..", "content_id": "..", "score": 0.9}, ...]`

**Logic**:
1. Fetch user `user_interactions`
2. Find liked `content` categories
3. Recommend similar content from `content` table

## Test

```bash
# Smoke test
python smoke_app.py
```

## Dependencies

```
fastapi
uvicorn[standard]
supabase
python-dotenv
```

Ready! Start w/ `uvicorn main:app --reload`.

