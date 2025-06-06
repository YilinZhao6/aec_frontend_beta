import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import {
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Type, Share2, History,
  FileText, Star, MessageSquare, Clock, MoreVertical
} from 'lucide-react';
import TopToolbar from '../../../../components/workspaceView/topToolbar/TopToolbar';
import PageBar from '../../../../components/workspaceView/pageBar/PageBar';

const NoteEditorPage = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
    ],
    content: '<h1>Welcome to your new note!</h1>',
    editorProps: {
      attributes: {
        class: 'focus:outline-none'
      }
    }
  });

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border-b border-gray-200">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Untitled document"
              className="text-lg font-medium border-none focus:outline-none"
            />
            <Star className="w-5 h-5 text-gray-400 cursor-pointer hover:text-yellow-400" />
          </div>
          
          <div className="flex items-center gap-4">
            <History className="w-5 h-5 text-gray-600 cursor-pointer" />
            <MessageSquare className="w-5 h-5 text-gray-600 cursor-pointer" />
            <Share2 className="w-5 h-5 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 h-12">
          {/* Font Controls */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
            <select 
              className="h-8 px-2 border border-gray-200 rounded"
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
            
            <select 
              className="h-8 w-20 px-2 border border-gray-200 rounded"
              onChange={(e) => {
                const size = parseInt(e.target.value);
                editor.chain().focus().setFontSize(size).run();
              }}
            >
              {[8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <TopToolbar />
      <PageBar />
      <div className="bg-white min-h-[calc(100vh-148px)]">
        <MenuBar />
        <div className="max-w-[850px] mx-auto pt-8 px-4">
          <EditorContent editor={editor} className="min-h-[calc(100vh-12rem)] prose max-w-none focus:outline-none [&_*]:focus:outline-none" />
        </div>
      </div>
    </div>
  );
};

export default NoteEditorPage;