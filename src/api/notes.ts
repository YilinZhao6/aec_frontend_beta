interface NoteFolder {
  files: string[];
  folder_name: string;
  subfolders: NoteFolder[];
}

interface NotesResponse {
  success: boolean;
  folder_tree?: NoteFolder;
  message?: string;
}

export const notesAPI = {
  getNoteTree: async (userId: string): Promise<NotesResponse> => {
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/note/get_user_note_tree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  }
};