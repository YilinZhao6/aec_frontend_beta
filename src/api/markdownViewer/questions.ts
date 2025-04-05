interface QuestionResponse {
  explanation?: string;
  error?: string;
}

export const questionsAPI = {
  askQuestion: async (userId: string, conversationId: string, question: string): Promise<QuestionResponse> => {
    try {
      const response = await fetch('https://backend-aec-experimental.onrender.com/ask_in_section_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          conversation_id: conversationId,
          question: question
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to ask question:', error);
      throw error;
    }
  }
};