import { supabase } from '../config/supabaseClient.js';

export const addInteraction = async (req, res) => {
  try {
    const { user_id, content_id, action_type, rating } = req.body;
    if (!user_id || !content_id) {
      return res
        .status(400)
        .json({ error: "user_id and content_id are required" });
    }

    const { data, error } = await supabase
      .from('user_interactions')
      .insert([{ user_id, content_id, action_type, rating }]);

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
};