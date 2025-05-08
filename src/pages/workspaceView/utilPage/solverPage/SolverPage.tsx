import React, { useState } from 'react';
import { Search, Camera, Clock, ArrowRight } from 'lucide-react';
import TopToolbar from '../../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../../components/workspaceView/pageBar/PageBar';

interface SearchHistory {
  id: string;
  query: string;
  subject: string;
  timestamp: string;
}

const SolverPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchHistory: SearchHistory[] = [
    {
      id: '1',
      query: 'Solve the quadratic equation: 2x² + 5x - 3 = 0',
      subject: 'Math',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      query: 'Calculate the force needed to accelerate a 2kg mass at 5 m/s²',
      subject: 'Physics',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      query: 'Balance this chemical equation: Fe + O₂ → Fe₂O₃',
      subject: 'Chemistry',
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
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          <div className="p-8">
            {/* Main Search Area */}
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Problem Solver</h1>
              <p className="text-gray-600 mb-8">Get step-by-step explanations for your questions</p>

              <div className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type your question or math problem"
                    className="w-full px-6 py-4 text-lg bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400 pr-24"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search History */}
                <div className="pt-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Recent Questions</span>
                  </div>
                  <div className="space-y-3">
                    {searchHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item.query)}
                        className="w-full group flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{item.query}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{item.subject}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{item.timestamp}</span>
                          </div>
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
      </main>
    </div>
  );
};

export default SolverPage;