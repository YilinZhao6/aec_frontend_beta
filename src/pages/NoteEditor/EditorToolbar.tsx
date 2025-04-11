import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  TextQuote, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type,
  Highlighter,
  HelpCircle
} from 'lucide-react';
import ColorPicker from './components/ColorPicker';
import LatexButton from './components/LatexButton';
import ImageButton from './components/ImageButton';

// Color constants for text and highlighting
const TEXT_COLORS = [
  { name: 'Default', color: 'inherit' },
  { name: 'Gray', color: '#6B7280' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Yellow', color: '#F59E0B' },
  { name: 'Green', color: '#10B981' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Pink', color: '#EC4899' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', color: 'transparent', isNone: true },
  { name: 'Yellow', color: '#FEF9C3' },
  { name: 'Green', color: '#DCFCE7' },
  { name: 'Blue', color: '#DBEAFE' },
  { name: 'Purple', color: '#F3E8FF' },
  { name: 'Pink', color: '#FCE7F3' },
  { name: 'Red', color: '#FEE2E2' },
];

interface EditorToolbarProps {
  editor: any;
  onGenerateExplanation: () => void;
  isGenerating: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, 
  onGenerateExplanation, 
  isGenerating,
  activeTab,
  setActiveTab
}) => {
  const [activeTextColor, setActiveTextColor] = useState(TEXT_COLORS[0]);
  const [activeHighlightColor, setActiveHighlightColor] = useState(HIGHLIGHT_COLORS[0]);

  const handleTextColorChange = (color: { name: string; color: string }) => {
    if (editor) {
      setActiveTextColor(color);
      editor.chain().focus().setColor(color.color).run();
    }
  };

  const handleHighlightColorChange = (color: { name: string; color: string; isNone?: boolean }) => {
    if (editor) {
      setActiveHighlightColor(color);
      if (color.isNone) {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().setHighlight({ color: color.color }).run();
      }
    }
  };

  if (!editor) return null;

  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center px-4 py-1 bg-[#E1E1E1]">
        <div className="flex-1 flex items-center space-x-2">
          <select
            onChange={e => {
              const value = e.target.value;
              if (value === 'normal') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 })
                ? '1'
                : editor.isActive('heading', { level: 2 })
                ? '2'
                : editor.isActive('heading', { level: 3 })
                ? '3'
                : 'normal'
            }
            className="h-8 px-2 rounded border border-gray-300"
          >
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="normal">Normal</option>
          </select>

          <div className="h-5 w-px bg-gray-300" />

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <TextQuote className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-gray-300" />

          <ColorPicker
            colors={TEXT_COLORS}
            activeColor={activeTextColor}
            onChange={handleTextColorChange}
            icon={Type}
            label="Text Color"
          />

          <ColorPicker
            colors={HIGHLIGHT_COLORS}
            activeColor={activeHighlightColor}
            onChange={handleHighlightColorChange}
            icon={Highlighter}
            label="Highlight Color"
            isHighlight={true}
          />

          <div className="h-5 w-px bg-gray-300" />

          <ImageButton editor={editor} />

          <LatexButton editor={editor} />

          <div className="h-5 w-px bg-gray-300" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-gray-300" />

          <div className="flex items-center space-x-1 border border-gray-300 rounded">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-gray-300" />

          <button
            onClick={onGenerateExplanation}
            disabled={isGenerating}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Generate explanation for selected text"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditorToolbar;