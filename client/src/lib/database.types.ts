// Auto-generated Supabase types — keeps full type safety across the app.
// Run `supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts`
// to regenerate after schema changes.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "student" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "student" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "student" | "admin";
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          format: "video" | "article" | "interactive";
          estimated_minutes: number;
          thumbnail: string;
          instructor: string;
          rating: number;
          enrolled_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          format: "video" | "article" | "interactive";
          estimated_minutes: number;
          thumbnail: string;
          instructor: string;
          rating?: number;
          enrolled_count?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          format?: "video" | "article" | "interactive";
          estimated_minutes?: number;
          thumbnail?: string;
          instructor?: string;
          rating?: number;
          enrolled_count?: number;
        };
      };
      materials: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          type: "video" | "tutorial";
          url: string;
          duration_minutes: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          type: "video" | "tutorial";
          url: string;
          duration_minutes: number;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          type?: "video" | "tutorial";
          url?: string;
          duration_minutes?: number;
          order_index?: number;
        };
      };
      quizzes: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          created_at?: string;
        };
        Update: {
          course_id?: string;
          title?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string;
          text: string;
          options: string[];
          correct_index: number;
          explanation: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          text: string;
          options: string[];
          correct_index: number;
          explanation: string;
          order_index?: number;
        };
        Update: {
          text?: string;
          options?: string[];
          correct_index?: number;
          explanation?: string;
          order_index?: number;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          duration_seconds: number;
          created_at?: string;
        };
        Update: never;
      };
      student_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress: number;
          last_accessed: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress?: number;
          last_accessed?: string;
          updated_at?: string;
        };
        Update: {
          progress?: number;
          last_accessed?: string;
          updated_at?: string;
        };
      };
      telemetry: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          entity_id: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          entity_id: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: never;
      };
      material_progress: {
        Row: {
          id: string;
          user_id: string;
          material_id: string;
          progress_pct: number;
          time_spent_seconds: number;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          material_id: string;
          progress_pct?: number;
          time_spent_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
        Update: {
          progress_pct?: number;
          time_spent_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
