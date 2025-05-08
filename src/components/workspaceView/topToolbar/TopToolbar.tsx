import React from 'react';
import { UserCircle, Plus } from 'lucide-react';

const TopToolbar = () => {
  return (
    <div className="h-[8vh] min-h-[60px] border-b border-gray-200 bg-white flex items-center justify-between px-4">
      {/* Left Section - User Profile */}
      <div className="flex items-center space-x-3 bg-gray-50 py-2 px-3 rounded-lg">
        <UserCircle size={24} className="text-gray-600" />
        <div>
          <div className="text-sm font-medium text-gray-700">Mike Zhang</div>
          <div className="text-xs text-gray-500">Premium User</div>
        </div>
      </div>

      {/* Center - Window Switcher */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[40%]">
        <div className="bg-gray-100 rounded-2xl p-2 flex items-center justify-start space-x-3">
          <button className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            My Window
          </button>
          <button className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-400 transition-all">
            <Plus size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Right Section - Empty space for balance */}
      <div className="w-[200px]"></div>
    </div>
  );
};

export default TopToolbar;