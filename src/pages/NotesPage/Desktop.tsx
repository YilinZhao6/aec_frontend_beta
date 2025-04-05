import React, { useState, useEffect } from 'react';
import { FileText, Edit2, ExternalLink, Trash2, ChevronRight, ChevronDown, Plus, FolderPlus, Loader2 } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { notesAPI } from '../../api/notes';
import './NotesPage.css';

interface NoteFolder {
  files: string[];
  folder_name: string;
  subfolders: NoteFolder[];
}

const Desktop = () => {
  const [folderTree, setFolderTree] = useState<NoteFolder | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await notesAPI.getNoteTree(userId);
        if (response.success && response.folder_tree) {
          setFolderTree(response.folder_tree);
        } else {
          setError(response.message || 'Failed to fetch notes');
        }
      } catch (error) {
        setError('Error connecting to server');
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderPath)
        ? prev.filter(path => path !== folderPath)
        : [...prev, folderPath]
    );
  };

  const renderFile = (file: string, path: string = '') => (
    <div key={`${path}/${file}`} className="note-row">
      <div className="name-cell">
        <FileText size={16} />
        <span className="note-title">{file}</span>
      </div>
      <div className="created-cell">
        <span>-</span>
      </div>
      <div className="meta-cell">
        <span>-</span>
      </div>
      <div className="meta-cell">
        <span>-</span>
      </div>
      <div className="actions-cell">
        <button className="note-action-button">
          <ExternalLink size={14} />
        </button>
        <button className="note-action-button">
          <Edit2 size={14} />
        </button>
        <button className="note-action-button">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  const renderFolder = (folder: NoteFolder, path: string = '') => {
    const currentPath = path ? `${path}/${folder.folder_name}` : folder.folder_name;
    const isExpanded = expandedFolders.includes(currentPath);

    if (folder.folder_name === 'notes') {
      return (
        <>
          {folder.files.map(file => renderFile(file))}
          {folder.subfolders.map(subfolder => renderFolder(subfolder))}
        </>
      );
    }

    return (
      <div key={currentPath} className="folder-container">
        <div 
          className="folder-header"
          onClick={() => toggleFolder(currentPath)}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="folder-name">{folder.folder_name}</span>
          <span className="folder-count">({folder.files.length + folder.subfolders.length})</span>
        </div>

        {isExpanded && (
          <>
            {folder.files.map(file => renderFile(file, currentPath))}
            {folder.subfolders.map(subfolder => renderFolder(subfolder, currentPath))}
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="notes-container">
          <div className="loading-state">
            <Loader2 className="animate-spin" size={24} />
            <p>Loading notes...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="notes-container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="notes-container">
        <div className="notes-header">
          <h1 className="page-title">My Notes</h1>
          <div className="notes-actions">
            <button className="action-button">
              <Plus size={16} />
              <span>New Note</span>
            </button>
            <button className="action-button">
              <FolderPlus size={16} />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        <div className="notes-list-header">
          <div className="name-cell">Name</div>
          <div className="created-cell">Created</div>
          <div className="meta-cell">Owner</div>
          <div className="meta-cell">Word Count</div>
          <div className="actions-cell">Actions</div>
        </div>

        <div className="notes-list">
          {folderTree && renderFolder(folderTree)}
        </div>
      </div>
    </MainLayout>
  );
};

export default Desktop;