// =======================================================================
// --- FILE: frontend/src/App.jsx (REVISED) ---
// This is the main component with the most significant changes.
// It now manages conversation history, sends it to the backend,
// and handles the proactive follow-up timer.
// =======================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';
import { useTranslation } from 'react-i18next';
import './i18n';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <img
        src="/Sirion Menyapa Orang-orang buat ngechat.png"
        alt="Sirion Menyapa"
        className="w-32 h-32 mb-6"
      />
      <h2 className="text-3xl font-bold text-ftmm-prussian">
        {t('assistant_title')}
      </h2>
      <p className="text-gray-500 mt-2">
        {t('welcome')
          .split('\n')
          .map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
      </p>
    </div>
  );
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allChats, setAllChats] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const { t } = useTranslation();
  
  // --- NEW: Ref to hold the timer for proactive feedback ---
  const followUpTimer = useRef(null);

  useEffect(() => {
    if (selectedChatId && allChats[selectedChatId]) {
      setMessages(allChats[selectedChatId]);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, allChats]);

  // --- NEW: Function to handle proactive follow-up message ---
  const sendFollowUpMessage = () => {
    if (!selectedChatId || isLoading) return;

    const followUpMessage = {
      id: crypto.randomUUID(),
      content: t('follow_up_prompt') || "Is there anything else I can help you with?",
      isUser: false,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAllChats(prev => {
        const currentMessages = prev[selectedChatId] || [];
        // Avoid sending multiple follow-ups
        if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].id === followUpMessage.id) {
            return prev;
        }
        const updatedMessages = [...currentMessages, followUpMessage];
        return { ...prev, [selectedChatId]: updatedMessages };
    });
  };


  const handleSendMessage = async (messageContent) => {
    // --- MODIFIED: Clear any existing follow-up timer when user sends a message ---
    clearTimeout(followUpTimer.current);

    const userMessage = {
      id: crypto.randomUUID(),
      content: messageContent,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let currentChatId = selectedChatId;
    let historyForAPI = [];
    
    if (currentChatId === null) {
      currentChatId = crypto.randomUUID();
      const newChatTitle = messageContent.substring(0, 30) + (messageContent.length > 30 ? '...' : '');
      setChatHistory(prev => [{ id: currentChatId, title: newChatTitle, timestamp: 'Just now' }, ...prev]);
      setSelectedChatId(currentChatId);
      const initialMessages = [userMessage];
      setAllChats(prev => ({ ...prev, [currentChatId]: initialMessages }));
      setMessages(initialMessages);
      // History is empty for the first message
      historyForAPI = [];
    } else {
      // --- MODIFIED: Prepare history before adding the new user message ---
      historyForAPI = allChats[currentChatId] || [];
      const updatedMessages = [...historyForAPI, userMessage];
      setAllChats(prev => ({ ...prev, [currentChatId]: updatedMessages }));
      setMessages(updatedMessages);
    }
    
    setIsLoading(true);

    try {
      // --- MODIFIED: Send conversation history along with the query ---
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query: messageContent,
            history: historyForAPI.map(msg => ({ // Send a simplified history
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.content
            }))
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const responseContent = data.response.toLowerCase();
      const sadKeywords = ["sorry", "maaf", "i don't know", "tidak tahu", "tidak dapat menemukan", "i cannot"];
      const isSadResponse = sadKeywords.some(keyword => responseContent.includes(keyword));
      
      const aiResponse = {
        id: crypto.randomUUID(),
        content: data.response,
        isUser: false,
        type: isSadResponse ? 'error' : 'success',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAllChats(prev => {
        const updatedMessages = [...(prev[currentChatId] || []), aiResponse];
        return { ...prev, [currentChatId]: updatedMessages };
      });

      // --- NEW: Start the timer for a follow-up message after a successful response ---
      followUpTimer.current = setTimeout(sendFollowUpMessage, 10000); // 10 seconds

    } catch (error) {
      console.error("Could not fetch AI response:", error);
      const errorResponse = {
        id: 'error-msg',
        content: t("ai_error") || "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isUser: false,
        type: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAllChats(prev => {
        const updatedMessages = [...(prev[currentChatId] || []), errorResponse];
        return { ...prev, [currentChatId]: updatedMessages };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setSidebarOpen(true);
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setSidebarOpen(true);
  };

  // --- NEW: Function to handle user typing, to cancel the follow-up timer ---
  const handleUserTyping = () => {
      clearTimeout(followUpTimer.current);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-4 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-ftmm-prussian text-lg truncate">
            {selectedChatId ? chatHistory.find(c => c.id === selectedChatId)?.title : t('new_chat')}
          </h1>
        </header>
        <main className="flex-1 flex flex-col">
          {messages.length === 0 && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex-1 flex items-center justify-center -mt-16">
                <WelcomeScreen />
              </div>
              <div className="w-full p-4">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onTyping={handleUserTyping} />
                <footer className="text-center text-xs text-gray-400 pt-2">
                  {t('ai_generated')}
                </footer>
              </div>
            </div>
          ) : (
            <>
              <ChatBox messages={messages} isLoading={isLoading} />
              <div className="w-full p-4 flex-shrink-0">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onTyping={handleUserTyping} />
                <footer className="text-center text-xs text-gray-400 pt-2">
                  {t('ai_generated')}
                </footer>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;