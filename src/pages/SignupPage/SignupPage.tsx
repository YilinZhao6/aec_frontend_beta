import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAuthAPI } from '../../api/user_auth';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.email !== formData.confirmEmail) {
      showMessage('error', 'Emails do not match!');
      return;
    }

    try {
      const data = await userAuthAPI.signup(formData);

      if (data.message) {
        showMessage('success', 'Account created successfully!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showMessage('error', data.error || 'Registration failed');
      }
    } catch (err) {
      showMessage('error', 'Server error. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join us to start your learning journey</p>
        </div>

        {message.text && (
          <div className={`alert ${
            message.type === 'success' ? 'alert-success' : 'alert-error'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="name-group">
            <div className="input-group">
              <label className="input-label">First Name</label>
              <div className="input-wrapper">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <User className="input-icon" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Last Name</label>
              <div className="input-wrapper">
                <input
                  name="lastName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <User className="input-icon" />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <input
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <Mail className="input-icon" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Email</label>
            <div className="input-wrapper">
              <input
                name="confirmEmail"
                type="email"
                required
                className="input-field"
                placeholder="Confirm your email"
                value={formData.confirmEmail}
                onChange={handleChange}
              />
              <Mail className="input-icon" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <input
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              <Lock className="input-icon" />
            </div>
          </div>

          <button type="submit" className="signup-button">
            <UserPlus size={20} />
            <span>Create Account</span>
          </button>
        </form>

        <div className="signup-footer">
          <p className="text-sm text-gray-700">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-gray-900 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;