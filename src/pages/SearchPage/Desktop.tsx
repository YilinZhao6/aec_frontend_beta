import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Book, Loader2, LogIn, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PAGE_STRINGS } from '../../constants/strings';
import { searchAPI } from '../../api/search';
import MainLayout from '../../components/Layout/MainLayout';
import SearchLoadingAnimation, { LoadingState } from './components/SearchLoadingAnimation';
import ParticleBackground from '../../components/ParticleBackground';
import HistorySections from './components/HistorySections';
import './SearchPage.css';

interface Book {
  book_id: string;
  author: string;
}

const Desktop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [searchMode, setSearchMode] = useState<'normal' | 'pro'>('normal');
  const [showBookPanel, setShowBookPanel] = useState(false);
  const [showBookPanelContent, setShowBookPanelContent] = useState(false);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState | 'idle'>('idle');
  const navigate = useNavigate();
  const eventSourceRef = useRef<EventSource | null>(null);

  const userFirstName = localStorage.getItem('user_first_name');
  const isLoggedIn = !!localStorage.getItem('user_id');
  const greeting = (() => {
    const hour = new Date().getHours();
    const timeBasedGreeting = hour >= 5 && hour < 18 
      ? 'Good morning' 
      : 'Good evening';
    return `${timeBasedGreeting}, ${userFirstName || 'Guest'}!`;
  })();

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
    if (!searchQuery.trim()) return;

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const saveQueryResponse = await fetch('https://backend-aec-experimental.onrender.com/save_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          user_id: userId,
          additional_comments: additionalInfo || undefined
        }),
      });

      const saveQueryData = await saveQueryResponse.json();
      if (!saveQueryData.conversation_id) {
        throw new Error('Failed to save query');
      }

      localStorage.setItem('conversation_id', saveQueryData.conversation_id);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      eventSourceRef.current = new EventSource(
        `https://backend-aec-experimental.onrender.com/generate?user_id=${userId}&conversation_id=${saveQueryData.conversation_id}&book_ids=${selectedBooks.join(',')}&websearch=${searchMode === 'pro'}`
      );

      eventSourceRef.current.onmessage = (event) => {
        const data = event.data;
        
        if (data.includes('Starting OpenAI web search')) {
          setLoadingState('collecting');
        } else if (data.includes('Starting Outline generation')) {
          setLoadingState('outlining');
        } else if (data.includes('Starting Article writing') || data.includes('Article generation completed successfully')) {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          navigate(`/markdown-viewer/generation/${userId}/${saveQueryData.conversation_id}`);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error('EventSource error:', error);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        setLoadingState('idle');
      };

    } catch (error) {
      console.error('Search failed:', error);
      setLoadingState('idle');
    }
  };

  const handleCancelSearch = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setLoadingState('idle');
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

  if (loadingState !== 'idle') {
    return (
      <SearchLoadingAnimation 
        loadingState={loadingState} 
        onCancel={handleCancelSearch} 
      />
    );
  }

  return (
    <MainLayout>
      <main className="content-container">
        <h1 className="greeting">{greeting}</h1>
        
        <div className="content-layout">
          <div className="search-card">
            <ParticleBackground />
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
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
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
                            <Check size={16} className="text-gray-600" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="login-prompt-container">
              <div className="login-prompt">
                <LogIn size={32} className="text-gray-400" />
                <h2 className="login-prompt-title">Log in to start your journey in Hyperknow</h2>
                <p className="login-prompt-text">
                  Access personalized learning experiences, save your progress, and unlock advanced features
                </p>
              </div>
            </div>
          ) : (
            <HistorySections />
          )}
        </div>
      </main>
    </MainLayout>
  );
};

export default Desktop;