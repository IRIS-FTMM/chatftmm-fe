import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center space-x-3">
          <img 
            src="/logo-ftmm.png" 
            alt="FTMM Logo" 
            className="w-8 h-8 rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="font-bold text-ftmm-prussian">FTMM Chatbot</h1>
        </div>
      </div>
    </header>
  );
}