/**
 * Telemetry utilities — ID generation and transport.
 */

import type { TelemetryEvent } from "./types";

/** Generate a short unique ID (good enough for client-side event dedup) */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Generate a session ID */
export function generateSessionId(): string {
  return `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Send a batch of events to the server.
 * Uses `navigator.sendBeacon` when available (works on tab close),
 * falls back to `fetch` with keepalive.
 */
export function sendBatch(endpoint: string, events: TelemetryEvent[]): boolean {
  if (events.length === 0) return true;

  const payload = JSON.stringify({ events, sentAt: Date.now() });

  // In development, just log to console instead of hitting a real endpoint
  if (import.meta.env.DEV) {
    console.log(
      `%c[Telemetry] Flushing ${events.length} event(s)`,
      "color: hsl(160, 84%, 39%); font-weight: bold;",
      events
    );
    return true;
  }

  // Production: use sendBeacon for reliability on page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    return navigator.sendBeacon(endpoint, blob);
  }

  // Fallback: fetch with keepalive
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Silently fail — telemetry should never break the app
  });

  return true;
}

/**
 * Send a single priority event immediately (e.g., explicit feedback).
 */
export function sendPriorityEvent(endpoint: string, event: TelemetryEvent): void {
  const payload = JSON.stringify({ events: [event], sentAt: Date.now(), priority: true });

  if (import.meta.env.DEV) {
    console.log(
      `%c[Telemetry] Priority event`,
      "color: hsl(262, 83%, 58%); font-weight: bold;",
      event
    );
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  }).catch(() => {});
}
