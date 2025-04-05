import React, { useState } from 'react';
import { MessageSquare, FileText } from 'lucide-react';
import QuestionsPanel from './QuestionsPanel';
import NotesPanel from './NotesPanel';

const RightSidePanel = () => {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'notes'

  return (
    <div className="bg-[#F0F0F0] border border-[#CCCCCC] rounded-lg overflow-hidden w-full h-[calc(100vh-140px)] flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#CCCCCC]">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'questions'
              ? 'bg-white border-b-2 border-gray-400 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'notes'
              ? 'bg-white border-b-2 border-gray-400 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Notes
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'questions' ? (
          <QuestionsPanel />
        ) : (
          <NotesPanel />
        )}
      </div>
    </div>
  );
};

export default RightSidePanel;