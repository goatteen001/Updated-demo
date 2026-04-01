// src/lib/api/quizzes.ts
// All quiz-related database operations

import { supabase } from "@/lib/supabase";

export async function fetchQuizzes() {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchQuizById(quizId: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("id", quizId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchQuizByCourseId(courseId: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("course_id", courseId)
    .single();

  if (error) throw error;
  return data;
}

export async function saveQuizAttempt(attempt: {
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  duration_seconds: number;
}) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    // Tell TS to trust us on the shape of this insert 
    // since the DB will auto-generate 'id' and 'created_at'
    .insert(attempt as any)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchUserQuizAttempts(userId: string) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    // Cast the deeply nested select string to 'any' to prevent TS parsing errors
    .select("*, quizzes(title, course_id, courses(title))" as any)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}