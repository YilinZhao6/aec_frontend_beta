import React from 'react';
import { ChevronsRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface RightPanelProps {
  concept: {
    concept: string;
    explanation: string;
    tag: string;
    mode?: 'normal' | 'pro';
  } | null;
  onClose: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ concept, onClose }) => {
  if (!concept) return null;

  return (
    <div className="fixed top-[6.5rem] right-0 w-[35%] h-[calc(100vh-6.5rem)] bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="font-quicksand font-semibold text-gray-800 text-lg">
              {concept.concept}
            </h2>
            <span className={`
              px-2.5 py-1 rounded-full text-xs font-medium font-quicksand
              ${concept.mode === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
            `}>
              {concept.mode === 'pro' ? 'Pro' : 'Normal'} Explanation
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Collapse"
          >
            <ChevronsRight size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className="prose prose-lg max-w-none font-quicksand"
            components={{
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed mb-4 font-quicksand">
                  {children}
                </p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-gray-900 mb-4 font-quicksand">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-gray-900 mb-3 font-quicksand">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-quicksand">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 font-quicksand">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 font-quicksand">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="font-quicksand">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-4 font-quicksand">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm text-gray-800 font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
                  {children}
                </pre>
              ),
            }}
          >
            {concept.explanation}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;