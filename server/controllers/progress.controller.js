import { supabase } from "../config/supabaseClient.js";

// Helper: Compute course progress % from materials (average of trackable)
const computeCourseProgressServer = async (userId, courseId) => {
  // Get trackable materials (video/tutorial)
  const { data: materials } = await supabase
    .from('materials')
    .select('id, type')
    .eq('course_id', courseId)
    .in('type', ['video', 'tutorial']);

  const trackable = materials || [];
  if (trackable.length === 0) return 0;

  // Get user's material progress
  const { data: matProgress } = await supabase
    .from('material_progress')
    .select('material_id, progress_pct, completed')
    .eq('user_id', userId)
    .in('material_id', trackable.map(m => m.id));

  if (!matProgress || matProgress.length === 0) return 0;

  const progressMap = new Map(matProgress.map(p => [p.material_id, p.completed ? 100 : p.progress_pct]));
  const totalPct = trackable.reduce((sum, m) => sum + (progressMap.get(m.id) || 0), 0);
  return Math.round(totalPct / trackable.length);
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("student_progress")  // Fixed table name
      .select(`
        course_id,
        progress,
        courses(title)
      `)
      .eq("user_id", userId);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { materialId, progressPct, timeSpentSeconds } = req.body;

    // Upsert material progress (mirror client)
    const { error: matError } = await supabase.from('material_progress').upsert({
      user_id: userId,
      material_id: materialId,
      progress_pct: Math.min(100, Math.max(0, progressPct)),
      time_spent_seconds: timeSpentSeconds || 0,
      completed: progressPct >= 90,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,material_id' });

    if (matError) throw matError;

    // Auto-update course progress
    const { data: material } = await supabase
      .from('materials')
      .select('course_id')
      .eq('id', materialId)
      .single();

    if (material?.course_id) {
      const courseProgress = await computeCourseProgressServer(userId, material.course_id);
      await supabase.from('student_progress').upsert({
        user_id: userId,
        course_id: material.course_id,
        progress: courseProgress,
        last_accessed: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' });
    }

    res.json({ success: true, courseProgress: material?.course_id ? await computeCourseProgressServer(userId, material.course_id) : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const computeCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const courseProgress = await computeCourseProgressServer(userId, courseId);
    await supabase.from('student_progress').upsert({
      user_id: userId,
      course_id: courseId,
      progress: courseProgress,
      last_accessed: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id' });

    res.json({ courseId, progress: courseProgress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
