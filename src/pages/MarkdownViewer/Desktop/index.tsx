import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { contentAPI } from '../../../api/markdownViewer/content';
import DocumentSectionsPanel from './components/DocumentSectionsPanel';
import RightSidePanel from './components/RightSidePanel';
import './MarkdownViewer.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

const MarkdownViewer = () => {
  const { source, userId, conversationId } = useParams();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      if (!userId || !conversationId) {
        setError('Missing required parameters');
        setIsLoading(false);
        return;
      }

      try {
        const response = await contentAPI.getMarkdownContent(userId, conversationId);
        if (response.success && response.content) {
          setContent(response.content);
        } else {
          setError(response.error || 'Failed to load content');
        }
      } catch (err) {
        setError('Error loading content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [userId, conversationId]);

  const handleBack = () => {
    if (source === 'explanations') {
      navigate('/explanations');
    } else {
      navigate('/');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/6 p-4">
        <DocumentSectionsPanel
          userId={userId || ''}
          conversationId={conversationId || ''}
          isArchiveView={source === 'explanations'}
        />
      </div>

      {/* Main Content */}
      <div className="w-4/6 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ReactMarkdown
              children={content}
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[
                rehypeHighlight,
                [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
                rehypeRaw
              ]}
              className="markdown-content"
            />
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/6 p-4">
        <RightSidePanel />
      </div>
    </div>
  );
};

export default MarkdownViewer;