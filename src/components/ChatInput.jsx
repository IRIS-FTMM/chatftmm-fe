import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
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
      className="relative flex items-end bg-gray-100 border border-gray-200 rounded-2xl p-2 max-w-3xl mx-auto"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        // PERBAIKAN: Menambah padding kanan (pr-12) agar teks tidak di bawah tombol
        className="flex-1 bg-transparent pl-3 pr-12 py-2 focus:outline-none resize-none"
        rows={1}
        maxLength={2000}
        disabled={isLoading}
        // PERBAIKAN: Menambah tinggi maksimal area teks
        style={{ maxHeight: '200px' }}
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={`
          absolute right-3 bottom-3 flex-shrink-0 p-2 rounded-full transition-colors
          ${message.trim() && !isLoading
            ? 'bg-ftmm-prussian text-white hover:bg-opacity-90' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <Send size={20} />
      </button>
    </form>
  );
}