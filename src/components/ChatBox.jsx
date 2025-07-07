import React, { useEffect, useRef } from 'react';
import Message from './Message';

const LoadingIndicator = () => (
  <div className="flex items-start space-x-3 p-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-ftmm-silver">
      <img src="/logo-ftmm.png" alt="FTMM" className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <div className="inline-block max-w-xs sm:max-w-md bg-gray-100 px-4 py-3 rounded-2xl shadow-sm rounded-bl-sm">
        <div className="flex items-center space-x-2">
          <span className="dot-loader"></span>
          <span className="dot-loader dot-loader-2"></span>
          <span className="dot-loader dot-loader-3"></span>
        </div>
      </div>
    </div>
  </div>
);

export default function ChatBox({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    // Wrapper untuk area chat yang bisa di-scroll
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}