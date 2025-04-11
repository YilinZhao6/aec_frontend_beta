import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  BookmarkPlus,
  Highlighter,
  Share2,
  Palette,
  ArrowLeft,
  Bold,
  Italic,
  TextQuote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  HelpCircle,
  X,
  FunctionSquare as Functions,
  Image as ImageIcon
} from 'lucide-react';

const TEXT_COLORS = [
  { color: '#000000' }, // Black
  { color: '#2F5496' }, // Dark Blue
  { color: '#ED7D31' }, // Orange
  { color: '#70AD47' }, // Green
  { color: '#FF0000' }, // Red
  { color: '#5B9BD5' }, // Blue
  { color: '#FFC000' }, // Gold
  { color: '#4472C4' }, // Blue-Gray
  { color: '#7030A0' }, // Purple
  { color: '#00B0F0' }, // Turquoise
  { color: '#9E480E' }, // Brown
  { color: '#997300' }, // Dark Yellow
  { color: '#43682B' }, // Dark Green
  { color: '#A5A5A5' }, // Gray
  { color: '#262626' }, // Dark Gray
  { color: '#7B7B7B' }, // Light Gray
];

const HIGHLIGHT_COLORS = [
  { color: 'transparent', isNone: true }, // No highlight
  { color: '#FFFF00' }, // Yellow
  { color: '#00FF00' }, // Green
  { color: '#00FFFF' }, // Cyan
  { color: '#FF00FF' }, // Pink
  { color: '#0000FF' }, // Blue
  { color: '#FF0000' }, // Red
  { color: '#FFFFFF' }, // White
  { color: '#FFE699' }, // Light Yellow
  { color: '#C6E0B4' }, // Light Green
  { color: '#BDD7EE' }, // Light Blue
  { color: '#F8CBAD' }, // Light Orange
  { color: '#E2C0FF' }, // Light Purple
  { color: '#FFB6C1' }, // Light Pink
  { color: '#D9D9D9' }, // Light Gray
  { color: '#F2F2F2' }, // Lighter Gray
];

interface ColorPickerProps {
  colors: { color: string; isNone?: boolean }[];
  activeColor: { color: string; isNone?: boolean };
  onChange: (color: { color: string; isNone?: boolean }) => void;
  icon: React.ElementType;
  label: string;
  isHighlight?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, activeColor, onChange, icon: Icon, label, isHighlight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-gray-100 relative group"
        title={label}
      >
        <Icon className="w-4 h-4" />
        <div 
          className="w-2 h-2 rounded-full absolute bottom-1 right-1"
          style={{ 
            backgroundColor: activeColor?.color || colors[0].color,
            border: activeColor?.isNone ? '1px solid #D1D5DB' : 'none'
          }}
        />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="grid grid-cols-4 gap-1 p-1" style={{ width: '120px' }}>
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className="w-5 h-5 rounded hover:scale-110 transition-transform relative"
                style={{ 
                  backgroundColor: color.color,
                  border: color.isNone ? '1px solid #D1D5DB' : '1px solid rgba(0,0,0,0.1)'
                }}
                title={color.isNone ? "No Highlight" : undefined}
              >
                {color.isNone && (
                  <X className="w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200' : ''}`}
    title={label}
  >
    <Icon className="w-4 h-4" />
  </button>
);

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isHighlightMode: boolean;
  onHighlightToggle: () => void;
  highlightColor: string;
  onColorChange: (color: string) => void;
  onPrint: () => void;
  onSavePDF: () => void;
  onBack: () => void;
  editor?: any;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  zoom,
  onZoomIn,
  onZoomOut,
  isHighlightMode,
  onHighlightToggle,
  highlightColor,
  onColorChange,
  onPrint,
  onSavePDF,
  onBack,
  editor
}) => {
  const [activeTextColor, setActiveTextColor] = useState(TEXT_COLORS[0]);
  const [activeHighlightColor, setActiveHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleTextColorChange = (color: { color: string }) => {
    if (editor) {
      setActiveTextColor(color);
      editor.chain().focus().setColor(color.color).run();
    }
  };

  const handleHighlightColorChange = (color: { color: string; isNone?: boolean }) => {
    if (editor) {
      setActiveHighlightColor(color);
      if (color.isNone) {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().setHighlight({ color: color.color }).run();
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPG, JPEG and PNG files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', localStorage.getItem('user_id') || '');

    try {
      const response = await fetch('https://backend-aec-experimental.onrender.com/note/upload_images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        const imageUrl = `https://backend-aec-experimental.onrender.com${data.url}`;
        editor.chain().focus().setImage({ 
          src: imageUrl,
          alt: file.name,
          title: file.name,
          width: 300,
          height: 'auto'
        }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="bg-gray-200 border-b border-[#CCCCCC] transition-colors duration-300 w-full">
      <div className="flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between h-11 px-4">
          {/* Left Tools Group */}
          <div className="flex items-center space-x-1">
            <ToolbarButton icon={ArrowLeft} label="Back" onClick={onBack} />
            <div className="mx-2 h-4 w-px bg-gray-300" />
            <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
            <div className="px-2 text-sm text-gray-900 font-quicksand">{zoom}%</div>
            <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
            <div className="mx-2 h-4 w-px bg-gray-300" />
            <ToolbarButton icon={BookmarkPlus} label="Save" onClick={() => {}} />
            <ToolbarButton icon={Share2} label="Share" onClick={() => {}} />
            <ToolbarButton icon={Printer} label="Print" onClick={onPrint} />
            <ToolbarButton icon={Download} label="PDF" onClick={onSavePDF} />
          </div>

          {/* Right Tools Group */}
          <div className="flex items-center space-x-1">
            <ToolbarButton 
              icon={Highlighter} 
              label="Highlight" 
              onClick={onHighlightToggle}
              isActive={isHighlightMode}
            />
            <ColorPicker 
              colors={HIGHLIGHT_COLORS}
              activeColor={activeHighlightColor}
              onChange={handleHighlightColorChange}
              icon={Highlighter}
              label="Highlight Color"
              isHighlight={true}
            />
          </div>
        </div>

        {/* Editor Toolbar */}
        {editor && (
          <div className="flex items-center px-4 py-1 bg-[#E1E1E1] border-t border-gray-300">
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

              <ToolbarButton
                icon={Bold}
                label="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
              />

              <ToolbarButton
                icon={Italic}
                label="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
              />

              <ToolbarButton
                icon={TextQuote}
                label="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
              />

              <div className="h-5 w-px bg-gray-300" />

              <ColorPicker
                colors={TEXT_COLORS}
                activeColor={activeTextColor}
                onChange={handleTextColorChange}
                icon={Type}
                label="Text Color"
              />

              <div className="h-5 w-px bg-gray-300" />

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-2 rounded hover:bg-gray-100"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-gray-300" />

              <ToolbarButton
                icon={List}
                label="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
              />

              <ToolbarButton
                icon={ListOrdered}
                label="Ordered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
              />

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};