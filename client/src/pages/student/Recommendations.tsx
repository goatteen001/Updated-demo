import { useCourses, useUserProgress, useUserQuizAttempts } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, Clock, ArrowRight, Loader2, Sparkles, PlayCircle, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchCourseProgressAPI } from "@/hooks/useProgressTracking";

interface CourseAIData {
  courseId: string;
  courseTitle: string;
  level: string;
  progress: number;
  completedMaterials: number;
  totalMaterials: number;
}

export default function Recommendations() {
  const { user } = useAuth();
  const { data: courses = [], isLoading: loadingCourses } = useCourses();
  const { data: progressData = [] } = useUserProgress();
  const { data: attempts = [] } = useUserQuizAttempts();
  const [courseAIData, setCourseAIData] = useState<CourseAIData[]>([]);

  // Fetch progress-based AI data for each active course
  useEffect(() => {
    if (!user?.id || progressData.length === 0) return;

    const fetchAll = async () => {
      const results: CourseAIData[] = [];
      for (const p of progressData as any[]) {
        try {
          const data = await fetchCourseProgressAPI(user.id, p.course_id);
          const level =
            data.progress <= 30 ? "beginner" :
            data.progress <= 70 ? "intermediate" : "advanced";
          results.push({
            courseId: p.course_id,
            courseTitle: p.courses?.title ?? "Course",
            level,
            progress: data.progress,
            completedMaterials: data.completed_materials,
            totalMaterials: data.total_materials,
          });
        } catch {
          // skip courses without progress data
        }
      }
      setCourseAIData(results);
    };

    fetchAll();
  }, [user?.id, progressData]);

  // Build a set of course IDs with low quiz scores (< 70%) as high-priority recs
  const lowScoreCourseIds = new Set(
    attempts
      .filter((a) => (a.score / a.total_questions) * 100 < 70)
      .map((a) => (a as any).quizzes?.course_id)
      .filter(Boolean)
  );

  // Build a set of course IDs the student has started
  const startedCourseIds = new Set(progressData.map((p: any) => p.course_id));

  // Prioritize: low score courses first, then unstarted courses
  const recommended = [
    ...courses.filter((c) => lowScoreCourseIds.has(c.id)),
    ...courses.filter((c) => !startedCourseIds.has(c.id) && !lowScoreCourseIds.has(c.id)),
  ].slice(0, 6);

  const getReason = (course: any) => {
    if (lowScoreCourseIds.has(course.id)) return "Low quiz score — review recommended";
    return "Not started yet — perfect next step";
  };

  const levelColors: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    intermediate: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    advanced: "text-rose-400 bg-rose-500/15 border-rose-500/30",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Recommendations</h1>
        <p className="text-muted-foreground">Personalized suggestions based on your learning behavior</p>
      </div>

      {/* AI Progress Level Section */}
      {courseAIData.length > 0 && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-bold font-display text-base">Your Learning Level</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {courseAIData.map((cd) => (
                <Link
                  key={cd.courseId}
                  to={`/courses/${cd.courseId}`}
                  className="group rounded-xl border border-border/60 bg-card/80 p-4 flex flex-col gap-2 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {cd.courseTitle}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${levelColors[cd.level] || levelColors.beginner}`}>
                      {cd.level.charAt(0).toUpperCase() + cd.level.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cd.completedMaterials}/{cd.totalMaterials} done · {cd.progress}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Brain className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">How recommendations work</p>
            <p className="text-muted-foreground mt-1">
              The AI analyzes your quiz performance and course progress to surface the most relevant courses.
              Courses with low quiz scores are prioritized so you can revisit and improve.
            </p>
          </div>
        </CardContent>
      </Card>

      {loadingCourses ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="group block">
              <div className="rounded-2xl border border-border/60 bg-card p-5 h-full flex flex-col gap-3 card-hover">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary flex-shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">{course.category}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{course.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{course.estimated_minutes}m
                  </span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    View course <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-2">
                  💡 {getReason(course)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
