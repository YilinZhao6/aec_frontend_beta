import { SectionResponse } from '../../types/markdown';

export const sectionsAPI = {
  getSections: async (userId: string, conversationId: string): Promise<SectionResponse> => {
    try {
      const url = new URL('https://backend-aec-experimental.onrender.com/get_sections');
      url.searchParams.append('user_id', userId);
      url.searchParams.append('conversation_id', conversationId);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      throw error;
    }
  }
};