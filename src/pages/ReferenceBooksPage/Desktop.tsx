import React, { useState } from 'react';
import { FileText, Trash2, Upload, Calendar, User2, AlertCircle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import './ReferenceBooksPage.css';

interface Book {
  id: number;
  title: string;
  created: string;
  owner: string;
  fileSize: string;
}

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Introduction to Machine Learning.pdf',
    created: '2024-03-15T08:00:00Z',
    owner: 'Yilin Zhao',
    fileSize: '12.5 MB'
  },
  {
    id: 2,
    title: 'Deep Learning Fundamentals.pdf',
    created: '2024-03-14T14:30:00Z',
    owner: 'Yilin Zhao',
    fileSize: '8.2 MB'
  },
  {
    id: 3,
    title: 'Neural Networks and Deep Learning.pdf',
    created: '2024-03-13T16:00:00Z',
    owner: 'Yilin Zhao',
    fileSize: '15.7 MB'
  }
];

const Desktop = () => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [isDragging, setIsDragging] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop here
  };

  return (
    <MainLayout>
      <div className="books-container">
        <div className="books-header">
          <h1 className="page-title">Upload Reference Books</h1>
        </div>

        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <Upload size={32} />
            <h3 className="upload-title">Drop your files here</h3>
            <p className="upload-text">or</p>
            <label className="upload-button">
              <input type="file" className="hidden" accept=".pdf,.epub,.mobi" multiple />
              Choose Files
            </label>
            <p className="upload-hint">Supported formats: PDF, EPUB, MOBI</p>
          </div>
        </div>

        <div className="books-list-header">
          <div className="name-cell">Name</div>
          <div className="created-cell">Created</div>
          <div className="meta-cell">Owner</div>
          <div className="meta-cell">Size</div>
          <div className="actions-cell">Actions</div>
        </div>

        <div className="books-list">
          {books.map(book => (
            <div key={book.id} className="book-row">
              <div className="name-cell">
                <FileText size={16} />
                <span className="book-title">{book.title}</span>
              </div>
              <div className="created-cell">
                <Calendar size={14} />
                <span>{formatDate(book.created)}</span>
              </div>
              <div className="meta-cell">
                <User2 size={14} />
                <span>{book.owner}</span>
              </div>
              <div className="meta-cell">
                <AlertCircle size={14} />
                <span>{book.fileSize}</span>
              </div>
              <div className="actions-cell">
                <button className="book-action-button">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Desktop;