// filepath: ie213-dating-app-fe/src/hooks/useBot.ts
import { useState, useCallback, useEffect } from 'react';
import { botApi } from '../api/botApi';

interface BotMessage {
  _id: string;
  content: string;
  timestamp: string;
  isUserMessage: boolean;
}

export const useBot = () => {
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await botApi.getConversation();
      if (response.data?.status === 'success') {
        // Thêm một tin nhắn chào mừng nếu không có tin nhắn nào
        if (Array.isArray(response.data.data.conversation) && response.data.data.conversation.length === 0) {
          const welcomeMessage: BotMessage = {
            _id: `welcome-${Date.now()}`,
            content: 'Xin chào! Mình là FAVOR AI - trợ lý hẹn hò thông minh. Mình có thể giúp bạn với các lời khuyên hẹn hò, cách trò chuyện hiệu quả hoặc tạo ấn tượng tốt. Bạn có điều gì muốn hỏi không?',
            timestamp: new Date().toISOString(),
            isUserMessage: false
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(response.data.data.conversation);
        }
      }
    } catch (err: any) {
      console.error('Fetch conversation error:', err);
      setError(err.message || 'Không thể tải lịch sử trò chuyện. Vui lòng tải lại trang.');
    } finally {
      setLoading(false);
    }
  }, []);
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    // Tạo một tin nhắn tạm thời từ người dùng để hiển thị ngay lập tức
    const tempUserMessage = {
      _id: `temp-${Date.now()}`,
      content: message,
      timestamp: new Date().toISOString(),
      isUserMessage: true
    };
    
    // Thêm tin nhắn người dùng vào state ngay lập tức
    setMessages(prev => [...prev, tempUserMessage]);
    
    setLoading(true);
    try {
      const response = await botApi.sendMessage(message);
      if (response.data?.status === 'success') {
        // Thay thế tin nhắn tạm thời với tin nhắn thực từ server (nếu cần)
        // và thêm phản hồi từ bot
        setMessages(prev => {
          // Lọc ra tin nhắn tạm thời nếu cần
          // const withoutTemp = prev.filter(msg => msg._id !== tempUserMessage._id);
          // return [...withoutTemp, response.data.data.message];
          
          // Hoặc đơn giản là thêm tin nhắn bot
          return [...prev, response.data.data.message];
        });
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Không thể gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);
  // Thêm một hàm để xóa lỗi
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    fetchConversation,
    clearError
  };
};