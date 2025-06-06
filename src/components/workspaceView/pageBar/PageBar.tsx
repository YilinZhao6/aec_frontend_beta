import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Plus } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  isActive: boolean;
  type: 'default' | 'note';
}

const PageBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'UW_Class Notes', isActive: location.pathname === '/workspace', type: 'default' },
    { id: '2', title: 'UW_Essay1', isActive: location.pathname === '/workspace/note', type: 'note' }
  ]);

  const handleTabClick = (id: string, type: 'default' | 'note') => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === id
    })));
    navigate(type === 'note' ? '/workspace/note' : '/workspace');
  };

  const handleTabClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== id);
      if (tabs.find(tab => tab.id === id)?.isActive) {
        newTabs[0].isActive = true;
        navigate(newTabs[0].type === 'note' ? '/workspace/note' : '/workspace');
      }
      setTabs(newTabs);
    }
  };

  const addNewTab = () => {
    const newTab = {
      id: String(Date.now()),
      title: 'New Tab',
      isActive: true,
      type: 'default' as const
    };
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: false
    })).concat(newTab));
    navigate('/workspace');
  };

  return (
    <div className="h-[40px] bg-[#fbfbfa] flex items-center px-2 border-b border-gray-200">
      <div className="flex h-[38px] items-center gap-1">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.type)}
            className={`
              group relative h-[32px] min-w-[180px] max-w-[240px] flex items-center 
              px-4 rounded-t-lg cursor-pointer
              ${tab.isActive 
                ? 'bg-white border-t border-l border-r border-gray-200' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            <span className="flex-1 text-sm truncate">{tab.title}</span>
            <button
              onClick={(e) => handleTabClose(e, tab.id)}
              className={`
                p-1 rounded-full hover:bg-gray-200
                ${tab.isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              `}
            >
              <X size={14} />
            </button>
            {tab.isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
            )}
          </div>
        ))}
        <button
          onClick={addNewTab}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
        >
          <Plus size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default PageBar;