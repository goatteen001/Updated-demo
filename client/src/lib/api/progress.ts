// src/lib/api/progress.ts
// Unified student progress tracking — stored in Supabase
// Standardized on 'user_material_progress' and 'user_course_progress'

import { supabase } from "@/lib/supabase";

/**
 * Get progress for all courses for a user.
 */
export async function fetchUserProgress(userId: string) {
  const { data, error } = await (supabase.from("user_course_progress") as any)
    .select("*, courses(title)")
    .eq("user_id", userId)
    .order("last_updated", { ascending: false });

  if (error) throw error;
  return (data || []).map((p: any) => ({
    ...p,
    last_accessed: p.last_updated, // backwards compatibility
  }));
}

/**
 * Get progress for a specific course.
 */
export async function fetchCourseProgress(userId: string, courseId: string) {
  const { data } = await (supabase.from("user_course_progress") as any)
    .select("progress")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  return data?.progress ?? 0;
}

/**
 * Upsert course-level progress (0–100).
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  progress: number
) {
  const { error } = await (supabase.from("user_course_progress") as any).upsert(
    {
      user_id: userId,
      course_id: courseId,
      progress: Math.min(100, Math.max(0, progress)),
      last_updated: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" }
  );

  if (error) throw error;

  // Also update the legacy student_progress (secondary sync)
  await (supabase.from("student_progress") as any).upsert({
    user_id: userId,
    course_id: courseId,
    progress: Math.min(100, Math.max(0, progress)),
    last_accessed: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).catch(() => {});
}

// ─── Material-level progress ─────────────────────────────────────────────────

/**
 * Get progress percentage for a single material.
 */
export async function fetchMaterialProgress(userId: string, materialId: string) {
  const { data } = await (supabase.from("user_material_progress") as any)
    .select("completed, completed_at")
    .eq("user_id", userId)
    .eq("material_id", materialId)
    .single();

  return data ? { progress_pct: data.completed ? 100 : 0, completed: data.completed } : { progress_pct: 0, completed: false };
}

/**
 * Update material progress (Supabase direct).
 */
export async function updateMaterialProgress(
  userId: string,
  materialId: string,
  progressPct: number,
  timeSpentSeconds: number
) {
  // We use unified completion logic: if progress >= 90, it's completed
  const isCompleted = progressPct >= 90;
  
  const { error } = await (supabase.from("user_material_progress") as any).upsert(
    {
      user_id: userId,
      material_id: materialId,
      completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,material_id" }
  );

  if (error) throw error;

  // Mirror to legacy material_progress (secondary sync)
  await (supabase.from("material_progress") as any).upsert({
    user_id: userId,
    material_id: materialId,
    progress_pct: progressPct,
    time_spent_seconds: timeSpentSeconds,
    completed: isCompleted,
    updated_at: new Date().toISOString(),
  }).catch(() => {});
}

/**
 * Force recompute/sync course progress via unified logic.
 */
export async function syncCourseProgress(userId: string, courseId: string) {
  // 1. Get the materials for the course
  const { data: materials } = await supabase.from("materials").select("id").eq("course_id", courseId);
  if (!materials?.length) return { progress: 0 };

  const materialIds = (materials as any[]).map(m => m.id);

  // 2. Count completed materials
  const { count } = await (supabase.from("user_material_progress") as any)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true)
    .in("material_id", materialIds);

  const completedCount = count || 0;
  const progress = Math.round((completedCount / materialIds.length) * 100);

  // 3. Update course-level table
  await updateCourseProgress(userId, courseId, progress);
  
  return { progress, completed_materials: completedCount, total_materials: materialIds.length };
}

/**
 * Unified calculation formula: (completed / total) * 100
 */
export async function computeCourseProgress(
  userId: string,
  materials: { id: string; type: string }[]
): Promise<number> {
  const trackable = materials.filter(m => m.type === "video" || m.type === "tutorial");
  if (trackable.length === 0) return 0;

  const { data } = await (supabase.from("user_material_progress") as any)
    .select("material_id, completed")
    .eq("user_id", userId)
    .eq("completed", true)
    .in("material_id", trackable.map(m => m.id));

  const completedCount = data?.length || 0;
  return Math.round((completedCount / trackable.length) * 100);
}
