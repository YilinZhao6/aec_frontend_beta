import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ParticleBackground from '../../components/ParticleBackground';
import './PreferencesPage.css';

const PreferencesPage = () => {
  const [activeTab, setActiveTab] = useState('education');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState<string[]>([]);
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const learningStyles = [
    'Visual Learning', 'Step-by-step Explanations', 'Mathematical Formulas',
    'Practical Examples', 'Historical Context', 'Diagrams & Charts',
    'Interactive Elements', 'Conceptual Understanding', 'Technical Details',
    'Brief Overview First', 'Detailed Explanations', 'Real-world Applications',
    'Analogies & Metaphors', 'Problem Solving', 'Proof-based Learning',
    'Easy Language',
  ];

  const educationLevels = [
    'Primary School', 'Middle School', 'High School', 'Undergraduate',
    'Graduate', 'PhD', 'Postdoctoral', 'Professional Researcher',
    'Industry Professional', 'Educator',
  ];

  const fetchUserPreferences = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
      const response = await fetch(`https://backend-aec-experimental.onrender.com/get_user_profile?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const preferences = data.preferences;

        setEducationLevel(preferences.education.level || []);
        setInstitution(preferences.education.institution || '');
        setFieldOfStudy(preferences.education.field_of_study || '');
        setSelectedStyles(preferences.learning_styles || []);
        setAdditionalPreferences(preferences.additional_preferences || '');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleSavePreferences = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const preferences = {
      education: {
        level: educationLevel,
        institution,
        field_of_study: fieldOfStudy,
      },
      learning_styles: selectedStyles,
      additional_preferences: additionalPreferences,
    };

    try {
      const response = await fetch('https://backend-aec-experimental.onrender.com/save_user_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, preferences }),
      });

      if (response.ok) {
        setShowSavedAlert(true);
        setTimeout(() => setShowSavedAlert(false), 2000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const BubbleSelection = ({ items, selected, onSelect }: {
    items: string[];
    selected: string[];
    onSelect: (item: string) => void;
  }) => (
    <div className="selection-grid">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`selection-item ${
            selected.includes(item) ? 'selected' : 'unselected'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="preferences-container">
        <ParticleBackground />
        
        <div className="preferences-header">
          <h1 className="page-title">Preferences</h1>
          <p className="page-subtitle">Customize your learning experience</p>
        </div>

        <div className="preferences-content">
          {/* Tab Selection */}
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('education')}
              className={`tab-button ${
                activeTab === 'education' ? 'active' : 'inactive'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`tab-button ${
                activeTab === 'learning' ? 'active' : 'inactive'
              }`}
            >
              Learning
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'education' && (
              <div className="form-section">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Education Level</h3>
                  <BubbleSelection
                    items={educationLevels}
                    selected={educationLevel}
                    onSelect={(item) =>
                      setEducationLevel((prev) =>
                        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                      )
                    }
                  />
                </div>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="input-label">Institution</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="text-input"
                      placeholder="Enter your institution"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="text-input"
                      placeholder="Enter your field of study"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'learning' && (
              <div className="form-section">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Preferred Learning Styles</h3>
                  <BubbleSelection
                    items={learningStyles}
                    selected={selectedStyles}
                    onSelect={(item) =>
                      setSelectedStyles((prev) =>
                        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Additional Preferences</label>
                  <textarea
                    value={additionalPreferences}
                    onChange={(e) => setAdditionalPreferences(e.target.value)}
                    className="textarea-input"
                    placeholder="Tell us about your preferred way of learning or any specific requirements..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="save-button"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Save Alert */}
        {showSavedAlert && (
          <div className="save-alert">
            Changes saved successfully
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PreferencesPage;