from fastapi import FastAPI
from supabase import create_client
import os
from typing import Any, cast
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(dotenv_path=str(Path(__file__).resolve().parent / ".env"))

app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
)

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) must be set in `ai-service/.env`."
    )

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

@app.get("/")
def home():
    return {"message": "AI Service Connected to Supabase 🚀"}


from services.recommendation_engine import RecommendationEngine
from typing import List

class RecommendRequest(BaseModel):
    user_id: str
    interests: List[str] = []


@app.post("/recommend")
async def recommend(payload: RecommendRequest):
    engine = RecommendationEngine(supabase)
    return engine.get_recommendations(payload.user_id, payload.interests)


# ─── Progress-based Recommendation ────────────────────────────────────────────

class ProgressRecommendRequest(BaseModel):
    user_id: str
    course_id: str
    progress: float
    completed_materials: int
    total_materials: int


def classify_level(progress: float) -> str:
    """Classify user difficulty level based on progress percentage."""
    if progress <= 30:
        return "beginner"
    elif progress <= 70:
        return "intermediate"
    else:
        return "advanced"


def get_level_message(level: str, progress: float) -> str:
    """Generate a motivational message based on level."""
    messages = {
        "beginner": f"You're just getting started ({progress:.0f}%)! Keep going — every lesson counts.",
        "intermediate": f"Great progress at {progress:.0f}%! You're building solid understanding.",
        "advanced": f"Almost there at {progress:.0f}%! You're mastering this course.",
    }
    return messages.get(level, f"You're at {progress:.0f}% progress.")


@app.post("/recommend/progress")
async def recommend_progress(payload: ProgressRecommendRequest):
    """
    Accept user progress data, classify level, and recommend next material.
    """
    level = classify_level(payload.progress)
    message = get_level_message(level, payload.progress)

    # Find uncompleted materials for this course
    recommended_next_material = None
    try:
        # Get all materials for the course
        materials_resp = (
            supabase.table("materials")
            .select("id, title, type, duration_minutes")
            .eq("course_id", payload.course_id)
            .order("created_at", desc=False)
            .execute()
        )
        all_materials = materials_resp.data or []

        # Get user's completed material IDs for this course
        completed_resp = (
            supabase.table("user_material_progress")
            .select("material_id")
            .eq("user_id", payload.user_id)
            .eq("completed", True)
            .execute()
        )
        completed_ids = {r["material_id"] for r in (completed_resp.data or [])}

        # Find first uncompleted material
        for mat in all_materials:
            if mat["id"] not in completed_ids:
                recommended_next_material = {
                    "id": mat["id"],
                    "title": mat["title"],
                    "type": mat.get("type", "unknown"),
                    "duration_minutes": mat.get("duration_minutes", 0),
                }
                break
    except Exception as e:
        print(f"[AI] Error fetching next material: {e}")

    return {
        "recommended_next_material": recommended_next_material,
        "difficulty_level": level,
        "message": message,
        "progress": payload.progress,
        "completed_materials": payload.completed_materials,
        "total_materials": payload.total_materials,
    }