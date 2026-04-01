import { supabase } from '../config/supabaseClient.js';

export const addTelemetryEvents = async (req, res) => {
  try {
    const body = req.body ?? {};
    const { events, sentAt } = body;

    if (!Array.isArray(events)) {
      return res
        .status(400)
        .json({ error: "Request body must include an `events` array" });
    }

    if (events.length === 0) {
      return res.status(204).send();
    }

    const rows = events.map((e) => {
      const entityId = e.entity_id ?? e.route ?? e.sessionId;

      return {
        user_id: e.user_id,
        event_type: e.type,
        entity_id: entityId,
        metadata: {
          ...((e.payload && typeof e.payload === 'object') ? e.payload : {}),
          route: e.route,
          sessionId: e.sessionId,
          sentAt,
        },
      };
    });

    // Basic required-field validation before inserting.
    for (const r of rows) {
      if (!r.user_id || !r.event_type || !r.entity_id) {
        return res.status(400).json({
          error: "Each telemetry event must include user_id, type, and route/sessionId",
        });
      }
    }

    const { error } = await supabase.from('telemetry').insert(rows);
    if (error) throw error;

    return res.status(201).json({ inserted: rows.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
};

