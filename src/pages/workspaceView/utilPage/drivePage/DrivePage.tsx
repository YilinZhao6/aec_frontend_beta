import React, { useState } from 'react';
import { 
  ChevronDown, Users, Clock, Database, Search, Grid, List as ListIcon,
  Info, MoreVertical, Download, Share2, Star, UserCircle, Folder, FileText
} from 'lucide-react';
import TopToolbar from '../../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../../components/workspaceView/pageBar/PageBar';

interface DriveFile {
  id: string;
  type: 'folder' | 'file';
  name: string;
  owner: string;
  lastModified: string;
  size: string;
}

const DrivePage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const files: DriveFile[] = [
    {
      id: '1',
      type: 'folder',
      name: 'Project Documents',
      owner: 'me',
      lastModified: 'May 29, 2024',
      size: '--'
    },
    {
      id: '2',
      type: 'folder',
      name: 'Research Papers',
      owner: 'me',
      lastModified: 'Apr 16, 2025',
      size: '--'
    },
    {
      id: '3',
      type: 'file',
      name: 'Final Presentation.pdf',
      owner: 'me',
      lastModified: 'Apr 8, 2025',
      size: '2.4 MB'
    },
    {
      id: '4',
      type: 'file',
      name: 'Meeting Notes.docx',
      owner: 'me',
      lastModified: 'Mar 29, 2025',
      size: '156 KB'
    }
  ];

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <TopToolbar />
      <PageBar />
      
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium">My Drive</h1>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in Drive"
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button 
              onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {viewMode === 'list' ? (
                <Grid className="w-5 h-5 text-gray-600" />
              ) : (
                <ListIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
            Type
            <ChevronDown className="w-4 h-4 ml-1 inline-block" />
          </button>
          <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
            People
            <ChevronDown className="w-4 h-4 ml-1 inline-block" />
          </button>
          <button className="px-4 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
            Modified
            <ChevronDown className="w-4 h-4 ml-1 inline-block" />
          </button>
        </div>

        {/* File List */}
        <div className="bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Owner</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last modified</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">File size</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr 
                  key={file.id}
                  onClick={() => toggleItemSelection(file.id)}
                  className={`hover:bg-gray-50 cursor-pointer border-b ${
                    selectedItems.includes(file.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
                        <Folder className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-500" />
                      )}
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{file.owner}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{file.lastModified}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{file.size}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrivePage;