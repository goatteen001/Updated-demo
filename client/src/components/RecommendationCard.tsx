/**
 * RecommendationCard — Displays an AI-recommended course/resource.
 * Includes explicit Thumbs Up / Thumbs Down feedback buttons
 * that fire priority (unbatched) telemetry events.
 */

import { ThumbsUp, ThumbsDown, Clock, BookOpen } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TelemetryAPI } from "@/lib/telemetry/types";

interface RecommendationCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  reason: string;
  telemetry: TelemetryAPI;
}

export function RecommendationCard({
  id,
  title,
  description,
  category,
  estimatedMinutes,
  reason,
  telemetry,
}: RecommendationCardProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    telemetry.sendFeedback(
      type === "positive" ? "feedback_positive" : "feedback_negative",
      { recommendationId: id, title, reason }
    );
  };

  return (
    <Card className="group relative overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-5">
        {/* Category badge */}
        <Badge variant="secondary" className="mb-3 text-xs font-medium">
          {category}
        </Badge>

        <h3 className="mb-1.5 text-lg font-semibold leading-tight text-foreground">
          {title}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Meta row */}
        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {reason}
          </span>
        </div>

        {/* Feedback row */}
        <div className="flex items-center gap-2">
          <span className="mr-auto text-xs text-muted-foreground">
            Was this helpful?
          </span>
          <Button
            size="sm"
            variant={feedback === "positive" ? "default" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => handleFeedback("positive")}
            disabled={feedback !== null}
            aria-label="Thumbs up"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={feedback === "negative" ? "destructive" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => handleFeedback("negative")}
            disabled={feedback !== null}
            aria-label="Thumbs down"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        {feedback && (
          <p className="mt-2 text-xs text-primary font-medium">
            Thanks for your feedback!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
