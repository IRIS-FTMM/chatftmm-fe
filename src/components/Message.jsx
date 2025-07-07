import React from 'react';
import { User } from 'lucide-react';

export default function Message({ content, isUser, timestamp }) {
  return (
    <div className={`flex items-start space-x-4 p-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-ftmm-pompadour' : 'bg-ftmm-silver'}
      `}>
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <img src="/logo-ftmm.png" alt="FTMM" className="w-5 h-5" />
        )}
      </div>
      
      {/* PERBAIKAN: Menambahkan 'min-w-0' di sini adalah kunci agar flex child bisa wrap */}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`
          inline-block max-w-full
          px-4 py-3 rounded-2xl shadow-sm
          ${isUser 
            ? 'bg-ftmm-pompadour text-white rounded-br-sm' 
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 px-1">
          {timestamp}
        </p>
      </div>
    </div>
  );
}
