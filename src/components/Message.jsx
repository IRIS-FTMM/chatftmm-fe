// =======================================================================
// --- FILE: frontend/src/components/Message.jsx (REVISED) ---
// Added `remark-gfm` to properly render Markdown tables as HTML tables.
// =======================================================================
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // --- NEW: Import GFM plugin for tables

const BotAvatar = ({ messageType }) => {
    // ... (This component remains unchanged)
    const getInitialAvatar = () => {
        if (messageType === 'success') return '/Sirion Berbicara.webm';
        if (messageType === 'error') return '/Sirion Sedih.webm';
        return '/Sirion Bisa Jawab.png';
    };
    const [avatarSrc, setAvatarSrc] = useState(getInitialAvatar());
    useEffect(() => { setAvatarSrc(getInitialAvatar()); }, [messageType]);
    const handleVideoEnd = () => { if (avatarSrc === '/Sirion Berbicara.webm') { setAvatarSrc('/Sirion Bisa Jawab.png'); } };
    const isVideo = avatarSrc.endsWith('.webm');
    return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-ftmm-silver overflow-hidden">
        {isVideo ? (
            <video key={avatarSrc} src={avatarSrc} autoPlay muted loop={avatarSrc !== '/Sirion Berbicara.webm'} onEnded={handleVideoEnd} className="w-full h-full object-cover" />
        ) : (
            <img src={avatarSrc} alt="Bot Avatar" className="w-full h-full object-cover" />
        )}
        </div>
    );
};

export default function Message({ message }) {
  const { content, isUser, timestamp, type } = message;

  return (
    <div className={`flex items-start space-x-4 p-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {isUser ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-ftmm-prussian">
          <User size={16} className="text-white" />
        </div>
      ) : (
        <BotAvatar messageType={type} />
      )}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-full px-4 py-3 rounded-2xl shadow-sm ${isUser ? 'bg-ftmm-prussian text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
          {/* --- MODIFIED: Added remarkPlugins for table support --- */}
          <div className={`prose prose-sm max-w-none text-left leading-relaxed ${isUser && 'prose-invert'}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-1">
          {timestamp}
        </p>
      </div>
    </div>
  );
}