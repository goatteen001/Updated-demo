import { supabase } from "../config/supabaseClient.js";

export const saveTelemetry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activeTimeMs } = req.body;

    const { data, error } = await supabase.from("telemetry").upsert([
      {
        user_id: userId,
        active_time_ms: activeTimeMs,
      },
    ]);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
