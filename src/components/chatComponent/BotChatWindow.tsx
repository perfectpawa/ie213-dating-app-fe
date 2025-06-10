// filepath: ie213-dating-app-fe/src/components/chatComponent/BotChatWindow.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useBot } from '../../hooks/useBot';
import { Bot, Send, User, AlertCircle } from 'lucide-react';

const BotChatWindow: React.FC = () => {
  const { messages, loading, error, sendMessage, fetchConversation } = useBot();
  const [inputValue, setInputValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout>();
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Fetch conversation when component mounts
    fetchConversation();
  }, [fetchConversation]);
    const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    
    // Xóa lỗi cũ (nếu có)
    setLocalError(null);
    
    const userMessage = inputValue;
    setInputValue('');
    
    // Hiển thị hiệu ứng "đang nhập..." khi chờ phản hồi
    setIsTyping(true);
    
    // Hủy hiệu ứng "đang nhập..." sau 15 giây nếu không nhận được phản hồi
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 15000);
    
    try {
      console.log('Sending message:', userMessage);
      
      const result = await sendMessage(userMessage);
      console.log('Send message result:', result);
      
      // Kết thúc hiệu ứng "đang nhập..."
      setIsTyping(false);
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      
      if (!result) {
        // Thêm phản hồi giả từ bot nếu không nhận được phản hồi từ server
        setLocalError('Không nhận được phản hồi từ server. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error('Error in handleSendMessage:', err);
      setLocalError(err?.message || 'Có lỗi xảy ra khi gửi tin nhắn');
      // Kết thúc hiệu ứng "đang nhập..." khi có lỗi
      setIsTyping(false);
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-[#4edcd8]" />
          <div>
            <h3 className="font-medium text-left text-white">FAVOR AI</h3>
            <p className="text-sm text-gray-400">Trợ lý hẹn hò thông minh</p>
          </div>
        </div>
      </div>
        {/* Error display */}
      {(error || localError) && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg mx-4 mt-4 p-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-red-200 text-sm">{error || localError}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto text-left">
        {console.log('Current messages:', messages)}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot size={48} className="text-[#4edcd8] mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">FAVOR AI - Trợ lý hẹn hò</h3>
            <p className="text-gray-400 max-w-md">
              Hỏi FAVOR AI về các lời khuyên hẹn hò, cách tương tác hoặc gợi ý cho buổi hẹn đầu tiên!
            </p>
          </div>
        ) : (          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex mb-4 ${msg.isUserMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.isUserMessage
                      ? 'bg-[#4edcd8] text-black rounded-br-none'
                      : 'bg-gray-800 text-white rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.isUserMessage ? (
                      <User size={14} className="text-black" />
                    ) : (
                      <Bot size={14} className="text-[#4edcd8]" />
                    )}
                    <span className="text-xs opacity-75">
                      {msg.isUserMessage ? 'Bạn' : 'FAVOR AI'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-right mt-1">
                    <span className="text-xs opacity-50">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Hiệu ứng "đang nhập..." */}
            {isTyping && (
              <div className="flex mb-4 justify-start">
                <div className="px-4 py-3 rounded-lg bg-gray-800 text-white rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <Bot size={14} className="text-[#4edcd8]" />
                    <span className="text-xs opacity-75">FAVOR AI</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 rounded-full bg-[#4edcd8] animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#4edcd8] animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#4edcd8] animate-pulse" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
            className="w-full bg-gray-800 border border-gray-700 rounded-full px-4 py-2 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#4edcd8]"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${
              loading || !inputValue.trim() 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-[#4edcd8] hover:bg-gray-700'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-gray-500 border-t-[#4edcd8] rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotChatWindow;