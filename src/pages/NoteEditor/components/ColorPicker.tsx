import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Color {
  name: string;
  color: string;
  isNone?: boolean;
}

interface ColorPickerProps {
  colors: Color[];
  activeColor: Color;
  onChange: (color: Color) => void;
  icon: LucideIcon;
  label: string;
  isHighlight?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  activeColor,
  onChange,
  icon: Icon,
  label,
  isHighlight = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded flex items-center space-x-1 ${
          activeColor.color !== 'inherit' && !activeColor.isNone ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        title={label}
      >
        <Icon className="w-4 h-4 text-gray-800" />
        <div 
          className="w-2 h-2 rounded-full ml-0.5"
          style={{ 
            backgroundColor: activeColor.color !== 'inherit' ? activeColor.color : undefined,
            border: activeColor.isNone ? '1px solid #D1D5DB' : undefined
          }}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="px-3 py-1 text-sm text-gray-500 border-b border-gray-200 mb-1">
              {label}
            </div>
            <div className="grid grid-cols-4 gap-1 p-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded flex items-center justify-center ${
                    activeColor.name === color.name ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  title={color.name}
                >
                  <div
                    className={`w-6 h-6 rounded ${
                      color.isNone ? 'border border-gray-300' : ''
                    }`}
                    style={{
                      backgroundColor: color.color,
                      border: isHighlight ? '1px solid rgba(0,0,0,0.1)' : undefined
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker;