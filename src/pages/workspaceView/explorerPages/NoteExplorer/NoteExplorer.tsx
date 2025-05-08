import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Grid, List, Info, MoreVertical, Search,
  FolderOpen, Clock, Star, Trash, Settings, FileText
} from 'lucide-react';
import TopToolbar from '../../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../../components/workspaceView/pageBar/PageBar';

interface Template {
  id: string;
  title: string;
  type: string;
  subtype?: string;
}

interface Document {
  id: string;
  title: string;
  lastOpened: string;
}

const NoteExplorer = () => {
  const navigate = useNavigate();
  
  const templates: Template[] = [
    {
      id: '1',
      title: 'Blank document',
      type: 'blank'
    },
    {
      id: '2',
      title: 'Essay',
      type: 'essay'
    },
    {
      id: '3',
      title: 'Report',
      type: 'report',
      subtype: 'Sample'
    },
    {
      id: '4',
      title: 'Book report',
      type: 'report',
      subtype: 'Book'
    }
  ];

  const recentDocuments: Document[] = [
    {
      id: '1',
      title: 'GLOBAL-CORE 1 Notes',
      lastOpened: 'May 6, 2025'
    },
    {
      id: '2',
      title: 'COCI2 Midterm Review',
      lastOpened: 'May 6, 2025'
    }
  ];

  const handleTemplateClick = () => {
    navigate('/workspace/note');
  };

  const handleDocumentClick = () => {
    navigate('/workspace/note');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <TopToolbar />
      <PageBar />
      
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium">Start a new document</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Grid size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="grid grid-cols-6 gap-3 mb-8">
          {templates.map(template => (
            <div
              key={template.id}
              onClick={handleTemplateClick}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-lg border border-gray-200 bg-white flex items-center justify-center mb-1.5 group-hover:border-blue-500 transition-colors">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">{template.title}</h3>
              {template.subtype && (
                <p className="text-xs text-gray-500">{template.subtype}</p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium">Recent documents</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents"
                  className="pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                <List size={20} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                <Info size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {recentDocuments.map(doc => (
              <div
                key={doc.id}
                onClick={handleDocumentClick}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/2] rounded-lg border border-gray-200 bg-white flex items-center justify-center mb-1.5 group-hover:border-blue-500 transition-colors">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                    <p className="text-xs text-gray-500">
                      <Clock size={12} className="inline mr-1" />
                      Opened {doc.lastOpened}
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-opacity">
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteExplorer;