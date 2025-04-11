import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAuthAPI } from '../../api/user_auth';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setIsGoogleScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || !document.getElementById('google-signin')) return;

      try {
        window.google.accounts.id.initialize({
          client_id: '976750923806-crklchaijhc9avntdmbcjnmf9eame6hs.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    if (isGoogleScriptLoaded) {
      setTimeout(initializeGoogleSignIn, 100);
    }
  }, [isGoogleScriptLoaded]);

  const handleGoogleResponse = async (response: any) => {
    try {
      const data = await userAuthAPI.googleAuth(response);

      if (data.user_id) {
        localStorage.setItem('user_id', data.user_id.toString());
        localStorage.setItem('user_email', data.email || '');
        localStorage.setItem('user_first_name', data.first_name || '');
        localStorage.setItem('user_last_name', data.last_name || '');
        
        setMessage({ 
          type: 'success', 
          text: 'Logged in successfully! Redirecting...'
        });
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Google authentication failed'
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Server error during Google authentication'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await userAuthAPI.login(email, password);

      if (data.user_id) {
        localStorage.setItem('user_id', data.user_id.toString());
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_first_name', data.first_name || '');
        localStorage.setItem('user_last_name', data.last_name || '');
        
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Redirecting...' 
        });
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Invalid credentials. Please try again.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Server error. Please try again later.' 
      });
    }
  };

  return (
    <div className="login-container">
      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue your learning journey</p>
        </div>

        {message.text && (
          <div className={`alert ${
            message.type === 'success' ? 'alert-success' : 'alert-error'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="input-icon" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                required
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="input-icon" />
            </div>
          </div>

          <button type="submit" className="login-button">
            <LogIn size={20} />
            <span>Sign In</span>
          </button>
        </form>

        <div className="divider">
          <div className="divider-line">
            <div className="divider-line-inner"></div>
          </div>
          <div className="divider-text">
            <span className="divider-text-inner">OR</span>
          </div>
        </div>

        <div id="google-signin" className="w-full flex justify-center mb-6"></div>

        <div className="login-footer">
          <a href="#" className="footer-link">
            Forgot your password?
          </a>
          <p className="text-sm text-gray-700">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-gray-900 hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;