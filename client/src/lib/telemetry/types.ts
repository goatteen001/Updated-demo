/**
 * Telemetry Types — Ground-truth behavioral data definitions.
 *
 * Every event type maps to a specific, measurable user behavior.
 * No vanity metrics. No ambiguous signals.
 */

export type TelemetryEventType =
  // Focus & Attention
  | "session_start"
  | "session_end"
  | "focus_gained"
  | "focus_lost"       // Tab switched away — timer pauses
  | "idle_start"       // No input for IDLE_THRESHOLD — timer pauses
  | "idle_end"         // User returned from idle
  // Engagement
  | "video_seek"       // Rewind/skip detection
  | "scroll_depth"     // Reading progress (time-correlated)
  | "quiz_hesitation"  // Time on a single question
  | "quiz_answer"
  // Extended Logic
  | "lesson_watch_start"
  | "lesson_watch_progress"
  | "lesson_replay"
  | "lesson_abandon"
  | "quiz_attempt"
  | "quiz_fail"
  | "quiz_pass"
  | "chunk_completed"
  | "pdf_open"
  | "pdf_reading_time"
  | "pdf_ignored"
  | "pdf_skipped"
  // Explicit Feedback
  | "feedback_positive"
  | "feedback_negative"
  // Custom
  | "custom";

export interface TelemetryEvent {
  /** Unique event ID */
  id: string;
  /** Supabase user id (required by backend telemetry table) */
  user_id: string;
  /** Event classification */
  type: TelemetryEventType;
  /** Unix timestamp (ms) */
  timestamp: number;
  /** Milliseconds the user was *actively focused* on the content */
  activeTimeMs: number;
  /** Arbitrary structured payload */
  payload: Record<string, unknown>;
  /** Current page/route */
  route: string;
  /** Session identifier (generated per mount) */
  sessionId: string;
}

export interface TelemetryConfig {
  /** API endpoint to POST batches to */
  endpoint: string;
  /** Batch flush interval in ms (default: 30_000) */
  batchIntervalMs?: number;
  /** Idle timeout in ms (default: 180_000 = 3 min) */
  idleTimeoutMs?: number;
  /** Max events per batch before force-flush */
  maxBatchSize?: number;
}

/** What the hook exposes to consumers */
export interface TelemetryAPI {
  /** Log any event */
  trackEvent: (type: TelemetryEventType, payload?: Record<string, unknown>) => void;
  /** Convenience: video seek tracking */
  trackVideoSeek: (oldTime: number, newTime: number) => void;
  /** Convenience: scroll depth tracking */
  trackScrollDepth: (percentage: number) => void;
  /** Convenience: quiz hesitation tracking */
  trackQuizHesitation: (questionId: string, timeSpentMs: number) => void;
  /** Send priority (unbatched) feedback event */
  sendFeedback: (type: "feedback_positive" | "feedback_negative", payload?: Record<string, unknown>) => void;
  /** Current active learning time in ms */
  activeTimeMs: number;
  /** Whether the user is currently focused & not idle */
  isActive: boolean;
  /** Current session ID */
  sessionId: string;
}
