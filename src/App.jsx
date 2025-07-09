import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';

// --- PERUBAHAN DI SINI ---
// Ambil URL API dari environment variable VITE_API_BASE_URL.
// Jika tidak ada (saat development lokal), gunakan alamat default 'http://127.0.0.1:8000'.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
// --- AKHIR PERUBAHAN ---

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center text-center p-4">
    <img 
      src="/logo-ftmm.png" 
      alt="FTMM Logo" 
      className="w-20 h-20 mb-6"
    />
    <h2 className="text-3xl font-bold text-ftmm-prussian">
      ChatFTMM
    </h2>
    <p className="text-gray-500 mt-2">
      How can I help you today?
    </p>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allChats, setAllChats] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChatId && allChats[selectedChatId]) {
      setMessages(allChats[selectedChatId]);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, allChats]);

  const handleSendMessage = async (messageContent) => {
    const userMessage = {
      id: crypto.randomUUID(),
      content: messageContent,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let currentChatId = selectedChatId;
    
    if (currentChatId === null) {
      currentChatId = crypto.randomUUID();
      const newChatTitle = messageContent.substring(0, 30) + (messageContent.length > 30 ? '...' : '');
      setChatHistory(prev => [{ id: currentChatId, title: newChatTitle, timestamp: 'Just now' }, ...prev]);
      setSelectedChatId(currentChatId);
      const initialMessages = [userMessage];
      setAllChats(prev => ({ ...prev, [currentChatId]: initialMessages }));
      setMessages(initialMessages);
    } else {
      const updatedMessages = [...(allChats[currentChatId] || []), userMessage];
      setAllChats(prev => ({ ...prev, [currentChatId]: updatedMessages }));
      setMessages(updatedMessages);
    }
    
    setIsLoading(true);

    try {
      // --- PERUBAHAN DI SINI ---
      // Gunakan variabel API_BASE_URL yang sudah kita definisikan di atas.
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
      // --- AKHIR PERUBAHAN ---
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: messageContent }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const aiResponse = {
        id: crypto.randomUUID(),
        content: data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAllChats(prev => {
        const updatedMessages = [...(prev[currentChatId] || []), aiResponse];
        return { ...prev, [currentChatId]: updatedMessages };
      });
    } catch (error) {
      console.error("Could not fetch AI response:", error);
      const errorResponse = {
        id: 'error-msg',
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isUser: false,
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

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-ftmm-prussian text-lg truncate">
            {selectedChatId ? chatHistory.find(c => c.id === selectedChatId)?.title : 'New Chat'}
          </h1>
        </header>
        
        <main className="flex-1 flex flex-col overflow-y-hidden">
          {messages.length === 0 && !isLoading ? (
            // Tampilan Awal (sebelum chat)
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex-1 flex items-center justify-center -mt-16">
                <WelcomeScreen />
              </div>
              <div className="w-full p-4">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                 <footer className="text-center text-xs text-gray-400 pt-2">
                  AI-generated, for reference only.
                </footer>
              </div>
            </div>
          ) : (
            // Tampilan Chat Aktif
            <>
              <ChatBox messages={messages} isLoading={isLoading} />
              <div className="w-full p-4 flex-shrink-0">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                 <footer className="text-center text-xs text-gray-400 pt-2">
                  AI-generated, for reference only. Press Shift+Enter for a new line.
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