import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenSquare, Brain, Search, Database, FileStack, 
  BookOpen, ChevronRight, ChevronLeft,
  MoreVertical, UserCircle, FileText
} from 'lucide-react';
import TopToolbar from '../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../components/workspaceView/pageBar/PageBar';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  path: string;
}

interface DriveFile {
  id: string;
  type: 'doc' | 'sheet' | 'shared';
  title: string;
  lastAction: string;
  timestamp: string;
  location: string;
}

const DefaultPage = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: '1',
      icon: <PenSquare size={24} />,
      title: 'Create Note',
      color: 'bg-blue-500',
      path: '/workspace/notes'
    },
    {
      id: '2',
      icon: <Brain size={24} />,
      title: 'Deep Research',
      color: 'bg-purple-500',
      path: '/workspace/research'
    },
    {
      id: '3',
      icon: <Search size={24} />,
      title: 'Problem Solver',
      color: 'bg-green-500',
      path: '/workspace/solver'
    },
    {
      id: '4',
      icon: <Database size={24} />,
      title: 'Drive',
      color: 'bg-orange-500',
      path: '/workspace/drive'
    },
    {
      id: '5',
      icon: <FileStack size={24} />,
      title: 'File Assistant',
      color: 'bg-pink-500',
      path: ''
    },
    {
      id: '6',
      icon: <BookOpen size={24} />,
      title: 'Summary',
      color: 'bg-indigo-500',
      path: '/workspace/summary'
    }
  ];

  const handleQuickActionClick = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

  const driveFiles: DriveFile[] = [
    {
      id: '1',
      type: 'doc',
      title: 'Supporting Documentation',
      lastAction: 'You edited',
      timestamp: 'May 5, 2025',
      location: 'Privacy Tech Final Project'
    },
    {
      id: '2',
      type: 'doc',
      title: 'Shree Case Study',
      lastAction: 'You opened',
      timestamp: '10:00 PM',
      location: 'Case Studies'
    },
    {
      id: '3',
      type: 'doc',
      title: 'GLOBAL-CORE 1 Notes',
      lastAction: 'You opened',
      timestamp: '10:00 PM',
      location: 'My Drive'
    },
    {
      id: '4',
      type: 'doc',
      title: 'COCI2 Midterm Review',
      lastAction: 'You opened',
      timestamp: '9:57 PM',
      location: 'My Drive'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <TopToolbar />
      <PageBar />
      
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-medium text-gray-900 mb-8">Good morning, User</h1>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <ChevronLeft size={14} />
              <span className="text-sm font-medium">Quick Actions</span>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={16} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            {quickActions.map(action => (
              <div 
                key={action.id}
                onClick={() => handleQuickActionClick(action.path)}
                className="aspect-square rounded-xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer bg-white group flex flex-col items-center justify-center"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-4">Suggested files</h2>
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reason suggested</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Owner</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {driveFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600">
                          <FileText size={20} />
                        </div>
                        <span className="text-sm text-gray-900">{file.title}</span>
                        {file.type === 'shared' && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Shared</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{file.lastAction} • {file.timestamp}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <UserCircle size={20} className="text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-900">me</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{file.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;