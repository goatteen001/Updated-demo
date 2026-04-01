/**
 * TelemetryDebugPanel — Live display of telemetry state.
 * Shows active time, focus status, and session info.
 * Only for development / demo purposes.
 */

import { Activity, Eye, EyeOff, Wifi } from "lucide-react";
import type { TelemetryAPI } from "@/lib/telemetry/types";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  telemetry: TelemetryAPI;
}

export function TelemetryDebugPanel({ telemetry }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shadow-lg font-mono text-xs">
      {/* Active indicator */}
      <div className="flex items-center gap-1.5">
        {telemetry.isActive ? (
          <Eye className="h-3.5 w-3.5 text-primary" />
        ) : (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className={telemetry.isActive ? "text-primary font-semibold" : "text-muted-foreground"}>
          {telemetry.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Active time */}
      <div className="flex items-center gap-1.5">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <span className="text-foreground">{formatTime(telemetry.activeTimeMs)}</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Session */}
      <div className="flex items-center gap-1.5">
        <Wifi className="h-3.5 w-3.5 text-muted-foreground telemetry-pulse" />
        <span className="text-muted-foreground truncate max-w-[80px]">{telemetry.sessionId.slice(0, 12)}</span>
      </div>
    </div>
  );
}
