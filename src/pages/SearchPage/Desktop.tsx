import React, { useState, useEffect } from 'react';
import { Search, Book, Clock, Loader2, Check } from 'lucide-react';
import { SEARCH_PAGE_STRINGS } from '../../constants/strings';
import { searchAPI } from '../../api/search';
import MainLayout from '../../components/Layout/MainLayout';
import './SearchPage.css';

interface Book {
  id: string;
  title: string;
  author: string;
}

const Desktop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'normal' | 'pro'>('normal');
  const [greeting, setGreeting] = useState('');
  const [showBookPanel, setShowBookPanel] = useState(false);
  const [showBookPanelContent, setShowBookPanelContent] = useState(false);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSearchQuery, setBookSearchQuery] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour >= 5 && hour < 18 
        ? SEARCH_PAGE_STRINGS.GREETING.MORNING 
        : SEARCH_PAGE_STRINGS.GREETING.EVENING
    );
  }, []);

  useEffect(() => {
    if (showBookPanel) {
      setTimeout(() => {
        setShowBookPanelContent(true);
      }, 150);
    } else {
      setShowBookPanelContent(false);
    }
  }, [showBookPanel]);

  useEffect(() => {
    const fetchBooks = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      setLoadingBooks(true);
      setBookError('');

      try {
        const result = await searchAPI.getVectorizedBooks(userId);

        if (result.success && result.data?.books) {
          const formattedBooks = result.data.books.map(book => ({
            id: book.book_id,
            title: book.book_id,
            author: book.author || 'Unknown Author'
          }));
          setAvailableBooks(formattedBooks);
        } else {
          setBookError(result.message || 'Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBookError('Failed to connect to the server');
      } finally {
        setLoadingBooks(false);
      }
    };

    if (showBookPanel) {
      fetchBooks();
    }
  }, [showBookPanel]);

  const handleSearch = async () => {
    try {
      await searchAPI.performSearch({
        query: searchQuery,
        conceptFamiliarity: 50,
        selectedBooks,
      });
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const toggleBook = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const getSelectionNumber = (bookId: string) => {
    return selectedBooks.indexOf(bookId) + 1;
  };

  const filteredBooks = availableBooks.filter(book => 
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <main className="content-container">
        <h1 className="greeting">{greeting}</h1>
        
        <div className="content-layout">
          <div className="search-card">
            <div className={`search-content ${showBookPanel ? 'with-books' : ''}`}>
              <div className="search-main">
                <div className="search-header">
                  <div className="mode-switch">
                    <button 
                      className={`mode-option ${searchMode === 'normal' ? 'active' : 'inactive'}`}
                      onClick={() => setSearchMode('normal')}
                    >
                      {SEARCH_PAGE_STRINGS.MODE.NORMAL}
                    </button>
                    <button 
                      className={`mode-option ${searchMode === 'pro' ? 'active' : 'inactive'}`}
                      onClick={() => setSearchMode('pro')}
                    >
                      {SEARCH_PAGE_STRINGS.MODE.PRO}
                    </button>
                  </div>
                </div>

                <div className="search-input-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder={SEARCH_PAGE_STRINGS.SEARCH.PLACEHOLDER}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    className="search-button"
                    onClick={handleSearch}
                  >
                    <Search size={20} />
                  </button>
                </div>

                <div className="action-bar">
                  <button 
                    className={`icon-button ${showBookPanel ? 'active' : ''}`}
                    title={SEARCH_PAGE_STRINGS.TOOLTIPS.REFERENCE_BOOKS}
                    onClick={() => setShowBookPanel(!showBookPanel)}
                  >
                    <Book size={20} />
                  </button>
                  <input
                    type="text"
                    className="comment-input"
                    placeholder={SEARCH_PAGE_STRINGS.SEARCH.KNOWLEDGE_PLACEHOLDER}
                  />
                </div>
              </div>

              {showBookPanel && (
                <div className={`books-panel ${showBookPanelContent ? 'show' : ''}`}>
                  <div className="book-search">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={bookSearchQuery}
                      onChange={(e) => setBookSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="books-list">
                    {loadingBooks ? (
                      <div className="books-loading">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Loading books...</span>
                      </div>
                    ) : bookError ? (
                      <div className="books-error">{bookError}</div>
                    ) : filteredBooks.length === 0 ? (
                      <div className="books-empty">
                        {availableBooks.length === 0 ? "No books available" : "No matching books found"}
                      </div>
                    ) : (
                      filteredBooks.map((book) => (
                        <div
                          key={book.id}
                          className={`book-item ${selectedBooks.includes(book.id) ? 'selected' : ''}`}
                          onClick={() => toggleBook(book.id)}
                          data-selection-number={selectedBooks.includes(book.id) ? getSelectionNumber(book.id) : ''}
                        >
                          <div className="book-info">
                            <Book size={16} />
                            <div className="book-details">
                              <span className="book-title">{book.title}</span>
                              <span className="book-author">{book.author}</span>
                            </div>
                          </div>
                          {selectedBooks.includes(book.id) && (
                            <Check size={16} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="history-sections">
            <div className="history-section">
              <div className="history-header">
                <h2 className="history-title">{SEARCH_PAGE_STRINGS.HISTORY.NOTES.TITLE}</h2>
              </div>
              <div className="history-list">
                {SEARCH_PAGE_STRINGS.HISTORY.NOTES.ITEMS.map((note) => (
                  <div key={note.id} className="history-item">
                    <div className="history-content">
                      <h3 className="history-item-title">{note.title}</h3>
                      <div className="history-meta">
                        <span>{note.date} • {note.time}</span>
                        <span className="history-duration">
                          <Clock size={12} />
                          {note.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="history-section">
              <div className="history-header">
                <h2 className="history-title">{SEARCH_PAGE_STRINGS.HISTORY.EXPLANATIONS.TITLE}</h2>
              </div>
              <div className="history-list">
                {SEARCH_PAGE_STRINGS.HISTORY.EXPLANATIONS.ITEMS.map((explanation) => (
                  <div key={explanation.id} className="history-item">
                    <div className="history-content">
                      <h3 className="history-item-title">{explanation.title}</h3>
                      <div className="history-meta">
                        <span>{explanation.date} • {explanation.time}</span>
                        <span className="history-duration">
                          <Clock size={12} />
                          {explanation.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Desktop;