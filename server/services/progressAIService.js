import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * Call the AI service /recommend/progress endpoint.
 * @param {{ user_id: string, course_id: string, progress: number, completed_materials: number, total_materials: number }} progressData
 * @returns {Promise<{ recommended_next_material: object|null, difficulty_level: string, message: string }>}
 */
export const fetchProgressRecommendation = async (progressData) => {
  const response = await axios.post(
    `${AI_SERVICE_URL}/recommend/progress`,
    progressData,
    { timeout: 5000 }
  );
  return response.data;
};
