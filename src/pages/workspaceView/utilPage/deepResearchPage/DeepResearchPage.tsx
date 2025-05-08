import React, { useState } from 'react';
import { Search, Book, Clock, ArrowRight } from 'lucide-react';
import TopToolbar from '../../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../../components/workspaceView/pageBar/PageBar';

interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}

const DeepResearchPage = () => {
  const [mode, setMode] = useState<'normal' | 'pro'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Mock search history data
  const searchHistory: SearchHistory[] = [
    {
      id: '1',
      query: 'What is quantum entanglement and how does it work?',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      query: 'Explain the concept of neural networks in machine learning',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      query: 'How does photosynthesis work in plants?',
      timestamp: '2 days ago'
    }
  ];

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <TopToolbar />
      <PageBar />
      
      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="content-layout">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <div className="p-8">
              {/* Mode Switch */}
              <div className="flex justify-end mb-8 -mr-2">
                <div className="bg-gray-100 p-1 rounded-full flex gap-1">
                  <button
                    onClick={() => setMode('normal')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      mode === 'normal' 
                        ? 'bg-white text-gray-900 shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setMode('pro')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      mode === 'pro' 
                        ? 'bg-white text-gray-900 shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pro
                  </button>
                </div>
              </div>

              {/* Main Search Area */}
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What's the concept you'd like to learn today?"
                      className="w-full px-6 py-4 text-lg bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-4 items-center pr-4">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                      <Book className="w-4 h-4" />
                      Sources
                    </button>
                    <input
                      type="text"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Tell us what you already know, or want to know about this topic"
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400"
                    />
                  </div>

                  {/* Search History */}
                  <div className="pt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Recent Searches</span>
                    </div>
                    <div className="space-y-3">
                      {searchHistory.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleHistoryClick(item.query)}
                          className="w-full group flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">{item.query}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.timestamp}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeepResearchPage;