import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, ExternalLink, Trash2, Clock, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { explanationsAPI } from '../../api/explanations';
import './ExplanationsPage.css';

interface Explanation {
  article_path: string;
  character_count: number;
  conversation_id: string;
  estimated_reading_time: number;
  generated_at: string;
  topic: string;
  user_id: string;
  word_count: number;
}

const Desktop = () => {
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExplanations = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await explanationsAPI.getExplanations(userId);
        if (response.success && response.data) {
          // Sort explanations by generated_at in descending order (newest first)
          const sortedExplanations = response.data.articles.sort((a, b) => 
            new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
          );
          setExplanations(sortedExplanations);
        } else {
          setError(response.message || 'Failed to fetch explanations');
        }
      } catch (error) {
        setError('Error connecting to server');
        console.error('Error fetching explanations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplanations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleOpenExplanation = (explanation: Explanation) => {
    navigate(`/markdown-viewer/explanations/${explanation.user_id}/${explanation.conversation_id}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="explanations-container">
          <div className="loading-state">
            <Loader2 className="animate-spin" size={24} />
            <p>Loading explanations...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="explanations-container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="explanations-container">
        <div className="explanations-header">
          <h1 className="page-title">My Explanations</h1>
        </div>

        <div className="explanations-list-header">
          <div className="name-cell">Name</div>
          <div className="created-cell">Created</div>
          <div className="meta-cell">Word Count</div>
          <div className="meta-cell">Reading Time</div>
          <div className="actions-cell">Actions</div>
        </div>

        <div className="explanations-list">
          {explanations.map(explanation => (
            <div key={explanation.conversation_id} className="explanation-row">
              <div className="name-cell">
                <FileText size={16} />
                <span className="explanation-title">{explanation.topic}</span>
              </div>
              <div className="created-cell">
                <Calendar size={14} />
                <span>{formatDate(explanation.generated_at)}</span>
              </div>
              <div className="meta-cell">
                <span>{explanation.word_count.toLocaleString()} words</span>
              </div>
              <div className="meta-cell">
                <Clock size={14} />
                <span>{explanation.estimated_reading_time} min</span>
              </div>
              <div className="actions-cell">
                <button 
                  className="open-button"
                  onClick={() => handleOpenExplanation(explanation)}
                >
                  OPEN
                </button>
                <button className="explanation-action-button">
                  <Edit2 size={14} />
                </button>
                <button className="explanation-action-button">
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