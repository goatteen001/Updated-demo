import { supabase } from '../config/supabaseClient.js';
import { fetchAIRecommendations } from '../services/recommendationService.js';

export const getRecommendations = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // 1. Check cache
    const { data: cached } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', user_id);

    if (cached && cached.length > 0) {
      return res.json(cached);
    }

    // 2. Call AI service
    const aiResults = await fetchAIRecommendations(user_id, []);
    if (!Array.isArray(aiResults)) {
      return res
        .status(502)
        .json({ error: "AI service returned unexpected recommendations payload" });
    }

    // 3. Save results
    await supabase.from('recommendations').insert(aiResults);

    res.json(aiResults);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
};