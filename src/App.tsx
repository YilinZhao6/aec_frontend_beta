import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import NotesPage from './pages/NotesPage';
import ReferenceBooksPage from './pages/ReferenceBooksPage';
import ExplanationsPage from './pages/ExplanationsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MarkdownViewer from './pages/MarkdownViewer/Desktop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/reference-books" element={<ReferenceBooksPage />} />
        <Route path="/explanations" element={<ExplanationsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/markdown-viewer/:source/:userId/:conversationId" 
          element={<MarkdownViewer />} 
        />
      </Routes>
    </Router>
  );
}

export default App;