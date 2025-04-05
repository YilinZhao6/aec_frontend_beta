import React, { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { questionsAPI } from '../../../../../api/markdownViewer/questions';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Question {
  question: string;
  answer?: string;
  isLoading?: boolean;
}

const QuestionsPanel = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem('user_id');
  const conversationId = localStorage.getItem('current_article_conversation_id');

  const askQuestion = async () => {
    if (!newQuestion.trim() || !userId || !conversationId || isSubmitting) return;

    const question = newQuestion.trim();
    setNewQuestion('');
    setIsSubmitting(true);

    // Add question immediately with loading state
    setQuestions(prev => [...prev, { question, isLoading: true }]);

    try {
      const response = await questionsAPI.askQuestion(userId, conversationId, question);
      
      setQuestions(prev => prev.map(q => 
        q.question === question
          ? { question, answer: response.explanation, isLoading: false }
          : q
      ));
    } catch (error) {
      setQuestions(prev => prev.map(q => 
        q.question === question
          ? { question, answer: "Failed to get answer", isLoading: false }
          : q
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {questions.length === 0 ? (
          <div className="text-center text-gray-500 font-quicksand">
            No questions yet
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-quicksand text-sm text-gray-800">{q.question}</p>
                </div>
                
                {q.isLoading ? (
                  <div className="flex items-center gap-2 p-3 text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="font-quicksand text-sm">Getting answer...</span>
                  </div>
                ) : q.answer && (
                  <div className="bg-white rounded-lg p-3 border border-[#CCCCCC]">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      className="font-quicksand text-sm text-gray-800"
                    >
                      {q.answer}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#CCCCCC]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 rounded-lg border border-[#CCCCCC] font-quicksand text-sm"
            onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          />
          <button
            onClick={askQuestion}
            disabled={isSubmitting}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPanel;