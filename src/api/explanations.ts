interface Explanation {
  article_path: string;
  character_count: number;
  conversation_id: string;
  estimated_reading_time: number;
  generated_at: string;
  topic: string;
  user_id: string;
  word_count: number;
}

interface ExplanationsResponse {
  success: boolean;
  data?: {
    articles: Explanation[];
  };
  message?: string;
}

export const explanationsAPI = {
  getExplanations: async (userId: string): Promise<ExplanationsResponse> => {
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_generated_explanations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch explanations:', error);
      throw error;
    }
  }
};