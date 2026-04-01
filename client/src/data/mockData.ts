export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructor: string;
  duration_minutes: number;
  enrolled_count: number;
  materials?: LearningMaterial[];
}

export interface LearningMaterial {
  id: string;
  course_id: string;
  title: string;
  type: "video" | "tutorial";
  url: string;
  duration_minutes: number;
  order_index: number;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  options: string[];
  correct_index: number;
  explanation: string;
  order_index: number;
}

export interface StudentProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_pct: number;
  last_accessed: string | null;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  duration_seconds: number;
  created_at: string;
}

// ALL STATIC DATA ARRAYS HAVE BEEN REMOVED.
// The application now fetches all data dynamically from Supabase.
