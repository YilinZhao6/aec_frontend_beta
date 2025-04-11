import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';

const NotesPanel = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#CCCCCC]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 rounded-lg border border-[#CCCCCC] font-quicksand text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
          />
          <button
            onClick={addNote}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 font-quicksand">
            No notes yet
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-[#CCCCCC] flex items-start gap-2"
              >
                <FileText size={16} className="text-gray-500 mt-1" />
                <span className="font-quicksand text-sm">{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;