import { useState, useEffect, useCallback } from 'react';
import { chatApi, Conversation, ChatMessage } from '../api/chatApi';
import { useAuth } from './useAuth';
import { playNotificationSound, showBrowserNotification } from '../utils/notifications';

export const useChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);// Lấy danh sách cuộc trò chuyện
    const fetchConversations = useCallback(async () => {
        if (!user?._id) return;
        
        setLoading(true);
        setError(null);
          try {
            const response = await chatApi.getConversations(user._id);
            console.log('Conversations response:', response);
            
            // Handle the response structure correctly
            if (response && response.data) {
                // Based on your debug output, the structure is response.data.data.conversations
                const conversations = response.data.data?.conversations || response.data.conversations || [];
                setConversations(conversations);
            }
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách cuộc trò chuyện');
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);    // Lấy tin nhắn của cuộc trò chuyện được chọn
    const fetchMessages = useCallback(async (otherUserId: string) => {
        if (!user?._id || !otherUserId) return;
        
        setLoading(true);
        setError(null);
    
        try {
            console.log(`Fetching messages between ${user._id} and ${otherUserId}`);
            
            const response = await chatApi.getConversation(user._id, otherUserId);
            console.log('Messages response:', response);
            
            if (response && response.data) {
                // Handle multiple possible response structures
                const messagesData = response.data.data?.messages || 
                                   response.data.messages || 
                                   [];
                
                console.log('Messages data:', messagesData);
                  // Validate and filter messages
                const validMessages = messagesData.filter((msg: any) => {
                    return msg && msg._id && msg.content !== undefined;
                });                // Check for new messages (only if this isn't the initial load)
                if (lastMessageCount > 0 && validMessages.length > lastMessageCount) {
                    const newMessageCount = validMessages.length - lastMessageCount;
                    const alertMessage = `${newMessageCount} tin nhắn mới!`;
                    setNewMessageAlert(alertMessage);
                    
                    // Play sound notification
                    playNotificationSound();
                    
                    // Show browser notification if permission granted
                    showBrowserNotification('Tin nhắn mới', alertMessage);
                    
                    // Clear alert after 3 seconds
                    setTimeout(() => {
                        setNewMessageAlert(null);
                    }, 3000);
                }
                
                setMessages(validMessages);
                setLastMessageCount(validMessages.length);
            } else {
                console.warn('No messages data in response');
                setMessages([]);
            }
        } catch (err: any) {
            console.error('Error fetching messages:', err);
            setError(err.response?.data?.message || err.message || 'Không thể tải tin nhắn');
            setMessages([]); // Reset messages on error to prevent crashes
        } finally {
            setLoading(false);
        }
    }, [user?._id]);    // Gửi tin nhắn
    const sendMessage = useCallback(async (content: string) => {
        if (!user?._id || !selectedConversation) return;
        
        console.log('Sending message:', { receiverId: selectedConversation.user._id, content });
        
        try {
            const response = await chatApi.sendMessage(
                selectedConversation.user._id,
                content
            );
            
            console.log('Send message response:', response);
              // Handle different possible response structures
            let newMessage: ChatMessage | null = null;
            if (response && response.data) {
                // Backend returns message data directly in response.data.data
                if (response.data.data) {
                    // Transform backend response to match ChatMessage interface
                    const messageData = response.data.data;
                    newMessage = {
                        _id: messageData._id,
                        sender: messageData.sender,
                        receiver: messageData.receiver,
                        content: messageData.content,
                        timestamp: messageData.timestamp,
                        createdAt: messageData.createdAt
                    } as ChatMessage;
                } else if (response.data._id) {
                    // If response.data is directly a message object
                    newMessage = response.data as ChatMessage;
                }
            }
              if (newMessage) {
                console.log('Processed new message:', newMessage);
                
                // Thêm tin nhắn mới vào danh sách ngay lập tức
                setMessages(prev => {
                    const updatedMessages = [...prev, newMessage];
                    console.log('Updated messages:', updatedMessages);
                    return updatedMessages;
                });
                
                // Cập nhật cuộc trò chuyện trong danh sách
                setConversations(prev => prev.map(conv => 
                    conv.user._id === selectedConversation.user._id
                        ? { ...conv, lastMessage: newMessage }
                        : conv
                ));
                
                // Refresh messages after sending to get any updates from server
                setTimeout(() => {
                    fetchMessages(selectedConversation.user._id);
                }, 500);
                
                // Also refresh conversations to update last message
                setTimeout(() => {
                    fetchConversations();
                }, 1000);
                
                return newMessage;
            } else {
                console.error('Failed to process message from response:', response);
                console.error('Response structure:', JSON.stringify(response, null, 2));
                
                // Check if there's an error in the response
                if (response?.error || response?.data?.error) {
                    throw new Error(`Server error: ${JSON.stringify(response.error || response.data.error)}`);
                }
                
                throw new Error('Phản hồi không hợp lệ từ server');
            }
        } catch (err: any) {
            console.error('Full error object:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || err.message || 'Không thể gửi tin nhắn');
            throw err;
        }
    }, [user?._id, selectedConversation, fetchMessages, fetchConversations]);    // Chọn cuộc trò chuyện
    const selectConversation = useCallback((conversation: Conversation) => {
        setSelectedConversation(conversation);
        setMessages([]); // Xóa tin nhắn cũ
        fetchMessages(conversation.user._id);
    }, [fetchMessages]);    // Clear any alerts after some time
    const clearAlert = useCallback(() => {
        setTimeout(() => {
            setNewMessageAlert(null);
        }, 3000);
    }, []);

    // Manual refresh function for pull-to-refresh or button click
    const refreshCurrentConversation = useCallback(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.user._id);
        }
        fetchConversations();
    }, [selectedConversation, fetchMessages, fetchConversations]);    // Tải danh sách cuộc trò chuyện khi component mount
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);return {
        conversations,
        messages,
        selectedConversation,
        loading,
        error,
        fetchConversations,
        fetchMessages,        sendMessage,
        selectConversation,
        setError,
        refreshCurrentConversation,
        newMessageAlert,
        setNewMessageAlert,
        clearAlert,
    };
};
