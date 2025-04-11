import React from 'react';
import { Settings, FileText, MessageSquare, BookOpen, Home, CreditCard, Bug, Languages, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GLOBAL_STRINGS, LAYOUT_STRINGS } from '../../constants/strings';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('user_email');
  const userFirstName = localStorage.getItem('user_first_name');
  const userLastName = localStorage.getItem('user_last_name');
  const fullName = userFirstName && userLastName ? `${userFirstName} ${userLastName}` : 'Please Sign In';
  const isLoggedIn = !!localStorage.getItem('user_id');

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_first_name');
      localStorage.removeItem('user_last_name');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      <nav className="side-nav">
        <div className="nav-sections">
          <div className="user-info">
            <div className="user-avatar">
              <User2 size={24} className="text-gray-600" />
            </div>
            <div className="user-details">
              <h3 className="user-name">{fullName}</h3>
              <p className="user-email">{userEmail || 'hyperknow.io'}</p>
            </div>
          </div>

          <div className="nav-section nav-section-main">
            <Link to="/" className="nav-link"><Home size={20} /> {LAYOUT_STRINGS.NAVIGATION.HOME}</Link>
            <Link to="/preferences" className="nav-link"><Settings size={20} /> {LAYOUT_STRINGS.NAVIGATION.PREFERENCES}</Link>
            <Link to="/notes" className="nav-link"><FileText size={20} /> {LAYOUT_STRINGS.NAVIGATION.NOTES}</Link>
            <Link to="/explanations" className="nav-link"><MessageSquare size={20} /> {LAYOUT_STRINGS.NAVIGATION.EXPLANATIONS}</Link>
            <Link to="/reference-books" className="nav-link"><BookOpen size={20} /> {LAYOUT_STRINGS.NAVIGATION.REFERENCE_BOOKS}</Link>
          </div>
          
          <div className="nav-section nav-section-bottom">
            <Link to="/subscription" className="nav-link"><CreditCard size={20} /> {LAYOUT_STRINGS.NAVIGATION.SUBSCRIPTION}</Link>
            <a href="#" className="nav-link"><Settings size={20} /> {LAYOUT_STRINGS.NAVIGATION.ACCOUNT_SETTINGS}</a>
            <Link to="/report-bug" className="nav-link"><Bug size={20} /> {LAYOUT_STRINGS.NAVIGATION.REPORT_BUG}</Link>
            <Link to="/community" className="nav-link"><MessageSquare size={20} /> Community Channels</Link>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <header className="top-header">
          <div className="header-actions">
            <button className="language-button">
              <Languages size={20} />
            </button>
            <button 
              className="sign-in-button"
              onClick={handleAuthClick}
            >
              {isLoggedIn ? 'Sign out' : GLOBAL_STRINGS.NAVIGATION.SIGN_IN}
            </button>
          </div>
        </header>

        <div className="white-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;