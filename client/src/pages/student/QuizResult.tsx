import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, ArrowLeft } from "lucide-react";

interface QuizResultState {
  score: number;
  total: number;
  duration: number;
  quizTitle: string;
}

export default function QuizResult() {
  const { state } = useLocation();
  const {
    score = 0,
    total = 0,
    duration = 0,
    quizTitle = "Quiz",
  } = (state as QuizResultState | null) || {};
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>

      <div className="space-y-2">
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${percentage >= 70 ? "bg-primary/10" : "bg-destructive/10"}`}
        >
          <Trophy
            className={`h-10 w-10 ${percentage >= 70 ? "text-primary" : "text-destructive"}`}
          />
        </div>
        <h1 className="text-3xl font-bold font-display">{quizTitle}</h1>
        <p className="text-muted-foreground">Quiz Complete!</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold font-display">{percentage}%</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="mx-auto h-5 w-5 text-warning mb-1" />
            <p className="text-2xl font-bold font-display">
              {score}/{total}
            </p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-5 w-5 text-info mb-1" />
            <p className="text-2xl font-bold font-display">{duration}s</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {percentage < 70 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="p-4 text-sm text-left">
            <p className="font-semibold text-warning">📊 AI Insight</p>
            <p className="text-muted-foreground mt-1">
              Your score suggests gaps in this topic. The AI recommendation
              engine will adjust your learning path to include prerequisite
              materials and alternative content formats.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 justify-center">
        <Button asChild variant="outline">
          <Link to="/recommendations">View Recommendations</Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
