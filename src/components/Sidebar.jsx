import React from 'react';
import { Plus, MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  chatHistory, 
  selectedChatId, 
  onSelectChat 
}) {
  const { t } = useTranslation();

  return (
    <aside className={`
      flex-shrink-0 bg-white shadow-lg 
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-0'}
      overflow-hidden
    `}>
      <div className="w-64 h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-ftmm-gradient p-4 relative">
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 p-1 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src="/Kepala Sirion.png"
              alt="Chatbot Logo" 
              className="w-10 h-10 rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-white font-bold text-lg">{t('assistant_title')}</h1>
              <p className="text-white text-sm opacity-90">{t('header')}</p>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="w-full bg-white bg-opacity-20 text-white py-2 px-4 rounded-lg hover:bg-opacity-30 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>{t('new_chat')}</span>
          </button>
        </div>
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            {t('recent_chats')}
          </h2>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-3
                  ${selectedChatId === chat.id 
                    ? 'bg-ftmm-prussian text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <MessageCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{chat.title}</p>
                  <p className={`text-xs mt-1 ${
                    selectedChatId === chat.id ? 'text-white opacity-80' : 'text-gray-500'
                  }`}>
                    {chat.timestamp}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
