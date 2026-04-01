import axios from "axios";

export const fetchAIRecommendations = async (user_id, interests = []) => {
  const aiServiceBaseUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  const response = await axios.post(`${aiServiceBaseUrl}/recommend`, {
    user_id,
    interests,
  });

  return response.data;
};
