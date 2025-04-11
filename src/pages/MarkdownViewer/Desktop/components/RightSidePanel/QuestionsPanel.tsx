import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Copy, Check, HelpCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { questionsAPI } from '../../../../../api/markdownViewer/questions';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Question {
  question: string;
  answer?: string;
  isLoading?: boolean;
  isStreaming?: boolean;
  timestamp?: number;
}

// New interface for welcome message
interface WelcomeMessage {
  message: string;
  timestamp: number;
}

const QuestionsPanel = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage>({
    message: "👋 Welcome! If you have any questions about the content or need clarification on specific points, feel free to ask here. I'm here to help you understand better!",
    timestamp: Date.now()
  });

  // Get values from localStorage with console logging for debugging
  const userId = localStorage.getItem('user_id');
  const conversationId = localStorage.getItem('current_article_conversation_id');
  
  // Log these values for debugging (will appear in the browser console)
  useEffect(() => {
    console.log("User ID:", userId);
    console.log("Conversation ID:", conversationId);
  }, [userId, conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const askQuestion = async () => {
    // Clear any previous error message
    setErrorMessage(null);
    
    // Check for empty question
    if (!newQuestion.trim()) {
      setErrorMessage("Please enter a question");
      return;
    }
    
    // Check for missing user ID or conversation ID
    if (!userId) {
      setErrorMessage("Missing user ID. Please reload the page or try again later.");
      console.error("Missing user_id in localStorage");
      return;
    }
    
    if (!conversationId) {
      setErrorMessage("Missing conversation ID. Please reload the page or try again later.");
      console.error("Missing current_article_conversation_id in localStorage");
      return;
    }
    
    if (isSubmitting) return;

    const question = newQuestion.trim();
    setNewQuestion('');
    setIsSubmitting(true);

    // Add question immediately with loading state
    setQuestions(prev => [...prev, { 
      question, 
      isLoading: true, 
      isStreaming: true, 
      answer: '',
      timestamp: Date.now()
    }]);

    try {
      // Use the streaming API
      await questionsAPI.askStreamingQuestion(
        userId,
        conversationId,
        question,
        // Handle each chunk of the response
        (chunk) => {
          setQuestions(prev => {
            const updatedQuestions = [...prev];
            const lastQuestion = updatedQuestions[updatedQuestions.length - 1];
            
            if (lastQuestion && lastQuestion.question === question) {
              lastQuestion.answer = (lastQuestion.answer || '') + chunk;
            }
            
            return updatedQuestions;
          });
        },
        // Handle completion
        () => {
          setQuestions(prev => prev.map(q => 
            q.question === question
              ? { ...q, isLoading: false, isStreaming: false }
              : q
          ));
          setIsSubmitting(false);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        },
        // Handle error
        (error) => {
          console.error("API Error:", error);
          setQuestions(prev => prev.map(q => 
            q.question === question
              ? { ...q, answer: `Error: ${error}`, isLoading: false, isStreaming: false }
              : q
          ));
          setIsSubmitting(false);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      );
    } catch (error) {
      console.error("Exception:", error);
      setQuestions(prev => prev.map(q => 
        q.question === question
          ? { ...q, answer: "Failed to get answer", isLoading: false, isStreaming: false }
          : q
      ));
      setIsSubmitting(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pb-2 space-y-6">
        {questions.length === 0 ? (
          <>
            {/* Welcome message from the bot */}
            <div className="space-y-2 animate-fadeIn mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{formatTime(welcomeMessage.timestamp)}</span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-gray-100 shadow-sm">
                      <p className="font-quicksand text-sm text-gray-800">{welcomeMessage.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 px-4 mt-4">
              <h3 className="text-lg font-medium text-gray-800 text-center">Ask me anything about this content</h3>
              <p className="text-gray-600 text-sm text-center max-w-xs">
                I can help explain concepts, provide additional information, or answer specific questions about the material.
              </p>
              
              <div className="w-full mt-2 space-y-2">
                <h4 className="text-gray-700 font-medium text-sm flex items-center">
                  <HelpCircle size={16} className="mr-2 text-indigo-400" />
                  Suggested questions
                </h4>
                <div className="space-y-2">
                  <div 
                    className="bg-white p-3 rounded-lg border border-gray-200 text-gray-800 text-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm hover:shadow"
                    onClick={() => {
                      setNewQuestion("Can you summarize the main points of this content?");
                    }}
                  >
                    Can you summarize the main points of this content?
                  </div>
                  <div 
                    className="bg-white p-3 rounded-lg border border-gray-200 text-gray-800 text-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm hover:shadow"
                    onClick={() => {
                      setNewQuestion("What are the key concepts I should understand?");
                    }}
                  >
                    What are the key concepts I should understand?
                  </div>
                </div>
              </div>

              {/* Display debug info for ids */}
              {(!userId || !conversationId) && (
                <div className="mt-4 text-xs text-gray-500 text-left w-full p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-medium text-red-700">Missing required data:</p>
                  <p>User ID: {userId || '❌ Not found'}</p>
                  <p>Conversation ID: {conversationId || '❌ Not found'}</p>
                  <p className="mt-1 text-xs text-red-600">Please reload the page or try navigating back to the document list.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Welcome message from the bot */}
            <div className="space-y-2 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{formatTime(welcomeMessage.timestamp)}</span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-gray-100 shadow-sm">
                      <p className="font-quicksand text-sm text-gray-800">{welcomeMessage.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {questions.map((q, index) => (
              <div key={index} className="space-y-2 animate-fadeIn">
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 space-y-1 flex justify-end">
                    <div className="space-y-1 max-w-[75%]">
                      <div className="flex justify-end items-center">
                        <span className="text-xs text-gray-500">{formatTime(q.timestamp)}</span>
                      </div>
                      <div className="bg-blue-600 rounded-2xl rounded-tr-none p-3 text-white inline-block">
                        <p className="font-medium text-sm">{q.question}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-medium text-white">You</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare size={14} className="text-white" />
                  </div>
                  <div className="flex-1 max-w-[75%]">
                    {q.isLoading ? (
                      <div className="flex items-center gap-2 p-3 text-gray-600 bg-gray-50 rounded-2xl rounded-tl-none animate-pulse">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-medium text-sm">
                          {q.isStreaming ? 'Thinking...' : 'Processing...'}
                        </span>
                      </div>
                    ) : q.answer && (
                      <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-gray-100 shadow-sm relative">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          className="font-quicksand text-sm text-gray-800 chat-markdown"
                        >
                          {q.answer}
                        </ReactMarkdown>
                        {q.isStreaming && (
                          <span className="streaming-cursor"></span>
                        )}
                        {!q.isStreaming && (
                          <button
                            onClick={() => copyToClipboard(q.answer || '', index)}
                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === index ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-md">
        {errorMessage && (
          <div className="mb-3 text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-100">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none transition-all shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          />
          <button
            onClick={askQuestion}
            disabled={isSubmitting}
            className={`p-3 rounded-full transition-all ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
            title="Send question"
          >
            <Send size={18} className={isSubmitting ? 'animate-pulse' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPanel;