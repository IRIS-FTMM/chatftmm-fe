import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// =======================================================================
// --- PERUBAHAN ADA DI SINI ---
// =======================================================================
const BotAvatar = ({ messageType }) => {
    const getInitialAvatar = () => {
        if (messageType === 'success') return '/Sirion Berbicara.webm';
        if (messageType === 'error') return '/Sirion Sedih.webm';
        return '/Sirion Bisa Jawab.png';
    };

    const [avatarSrc, setAvatarSrc] = useState(getInitialAvatar());
    
    useEffect(() => {
        setAvatarSrc(getInitialAvatar());
    }, [messageType]);

    const handleVideoEnd = () => {
        if (avatarSrc === '/Sirion Berbicara.webm') {
            setAvatarSrc('/Sirion Bisa Jawab.png');
        }
    };

    const isVideo = avatarSrc.endsWith('.webm');

    return (
        // [FIX 1] Tambahkan 'relative' untuk membuat container ini menjadi acuan posisi.
        <div className="relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-ftmm-silver overflow-hidden">
            {isVideo ? (
                <video 
                    key={avatarSrc} 
                    src={avatarSrc} 
                    autoPlay 
                    muted 
                    playsInline // [FIX 2] Tambahkan playsInline untuk kompatibilitas iOS Safari
                    loop={avatarSrc !== '/Sirion Berbicara.webm'} 
                    onEnded={handleVideoEnd}
                    // [FIX 3] Gunakan 'absolute' untuk memaksa video mengisi container.
                    className="absolute inset-0 w-full h-full object-cover" 
                />
            ) : (
                <img 
                    src={avatarSrc} 
                    alt="Bot Avatar" 
                    // [FIX 4] Samakan styling-nya dengan video.
                    className="absolute inset-0 w-full h-full object-cover" 
                />
            )}
        </div>
    );
};
// =======================================================================
// --- AKHIR DARI PERUBAHAN ---
// =======================================================================

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