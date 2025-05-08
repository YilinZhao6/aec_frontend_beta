import React, { useState } from 'react';
import { Send, FileText, Clock, ArrowRight, Upload, Image as ImageIcon } from 'lucide-react';
import TopToolbar from '../../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../../components/workspaceView/pageBar/PageBar';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

const SummaryPage = () => {
  const [input, setInput] = useState('');
  const [activeFile, setActiveFile] = useState<File | null>(null);

  const chatHistory: ChatHistory[] = [
    {
      id: '1',
      title: 'Research Paper Summary',
      timestamp: '2 hours ago',
      preview: 'Summary of "Advanced Machine Learning Techniques in..."'
    },
    {
      id: '2',
      title: 'Meeting Notes Recap',
      timestamp: '1 day ago',
      preview: 'Key points from the product strategy meeting...'
    },
    {
      id: '3',
      title: 'Book Chapter Analysis',
      timestamp: '2 days ago',
      preview: 'Chapter 5: The Evolution of Neural Networks...'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setActiveFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <TopToolbar />
      <PageBar />
      
      <div className="flex h-[calc(100vh-148px)]">
        {/* Left Sidebar - Chat History */}
        <div className="w-80 border-r border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">History</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Clock className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{chat.preview}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Messages */}
          <div className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Document Summary Assistant</h1>
                <p className="text-gray-600">Upload a document or paste text to get started</p>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload a document</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, Word, or text files</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message or paste text to summarize..."
                  className="w-full px-4 py-3 pr-24 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;