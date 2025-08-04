// =======================================================================
// --- FILE: frontend/src/components/ChatInput.jsx (REVISED) ---
// Added a new prop `onTyping` to notify the parent component when the user types.
// =======================================================================
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ChatInput({ onSendMessage, isLoading, onTyping }) { // Added onTyping
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleInputChange = (e) => {
      setMessage(e.target.value);
      if (onTyping) { // --- NEW: Call onTyping when input changes
          onTyping();
      }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-end bg-gray-100 border border-gray-200 rounded-2xl px-3 py-2 max-w-3xl mx-auto"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleInputChange} // --- MODIFIED: Use new handler
        onKeyPress={handleKeyPress}
        placeholder={t('type_here')}
        className="flex-1 bg-transparent px-2 py-2 focus:outline-none resize-none transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
        rows={1}
        maxLength={10000}
        disabled={isLoading}
        style={{ maxHeight: '200px' }}
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={`ml-2 flex-shrink-0 p-2 rounded-full transition-colors ${message.trim() && !isLoading ? 'bg-ftmm-pompadour text-white hover:bg-opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        style={{ marginBottom: '4px' }}
      >
        <Send size={20} />
      </button>
    </form>
  );
}
