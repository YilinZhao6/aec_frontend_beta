import React from "react";
import { Button } from "./button";
import { X } from "lucide-react";

interface TabProps {
  title: string;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ title, isActive, onClose, onClick }) => {
  return (
    <div
      className={`flex items-center h-8 px-4 border-r border-[#e2e2e2] cursor-pointer ${isActive ? "bg-white" : "bg-[#f5f5f5]"
        }`}
      onClick={onClick}
    >
      <span className="font-medium text-xs text-[#6b6b6b] font-['Inter',Helvetica]">
        {title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 p-0 h-auto"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X />
      </Button>
    </div>
  );
};