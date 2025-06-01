import { useState, useEffect, useCallback } from 'react';
import { chatApi, Conversation, ChatMessage } from '../api/chatApi';
import { useAuth } from './useAuth';

export const useChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);
      // Fetch all conversations
    const fetchConversations = useCallback(async () => {
        if (!user?._id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await chatApi.getConversations(user._id);
            console.log('Conversations response:', response);
            
            // Handle the response structure correctly
            if (response && response.data) {
                // Based on debug output, the structure is response.data.data.conversations
                const conversations = response.data.data?.conversations || response.data.conversations || [];
                
                // Process each conversation to ensure user data is properly formatted
                const processedConversations = conversations.map((conv: any) => {
                    // Make sure user field has necessary properties
                    if (conv.user) {
                        // If the backend sends user_name in the profile object but not at root level
                        if (!conv.user.user_name && conv.user.profile && conv.user.profile.full_name) {
                            conv.user.user_name = conv.user.profile.full_name;
                        }
                        
                        // If the backend sends profile_picture in the profile object but not at root level
                        if (!conv.user.profile_picture && conv.user.profile && conv.user.profile.profile_picture) {
                            conv.user.profile_picture = conv.user.profile.profile_picture;
                        }
                    }
                    return conv;
                });
                
                setConversations(processedConversations);
            }
        } catch (err: any) {
            setError(err.message || 'Could not load conversation list');
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);
      // Fetch conversations but preserve unreadCount for the selected conversation
    const fetchConversationsWithoutResetUnread = useCallback(async () => {
        if (!user?._id) return;
        
        try {
            console.log('Fetching conversations without resetting unread count');
            const response = await chatApi.getConversations(user._id);
            
            if (response && response.data) {
                const newConversations = response.data.data?.conversations || response.data.conversations || [];
                
                // Process conversations but maintain unreadCount=0 for the currently selected one
                const processedConversations = newConversations.map((conv: any) => {
                    // Format user data consistently
                    if (conv.user) {
                        if (!conv.user.user_name && conv.user.profile && conv.user.profile.full_name) {
                            conv.user.user_name = conv.user.profile.full_name;
                        }
                        
                        if (!conv.user.profile_picture && conv.user.profile && conv.user.profile.profile_picture) {
                            conv.user.profile_picture = conv.user.profile.profile_picture;
                        }
                    }
                    
                    // Keep unreadCount = 0 for the selected conversation
                    if (selectedConversation && conv.user._id === selectedConversation.user._id) {
                        console.log(`Preserving unreadCount=0 for selected conversation: ${conv.user.user_name || conv.user.username}`);
                        return { ...conv, unreadCount: 0 };
                    }
                    
                    return conv;
                });
                
                setConversations(processedConversations);
            }
        } catch (err: any) {
            console.error('Error refreshing conversations:', err);
        }
    }, [user?._id, selectedConversation]);
    
    // Fetch messages for a selected conversation
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
                });
                
                // Check for new messages (only if this isn't the initial load)
                // if (lastMessageCount > 0 && validMessages.length > lastMessageCount) {
                //     const newMessageCount = validMessages.length - lastMessageCount;
                //     const alertMessage = `${newMessageCount} tin nhắn mới!`;
                //     setNewMessageAlert(alertMessage);
                    
                //     // Play sound notification
                //     playNotificationSound();
                    
                //     // Show browser notification if permission granted
                //     showBrowserNotification('Tin nhắn mới', alertMessage);
                    
                //     // Clear alert after 3 seconds
                //     setTimeout(() => {
                //         setNewMessageAlert(null);
                //     }, 3000);
                // }
                
                setMessages(validMessages);
                setLastMessageCount(validMessages.length);
            } else {
                console.warn('No messages data in response');
                setMessages([]);
            }
        } catch (err: any) {
            console.error('Error fetching messages:', err);
            setError(err.response?.data?.message || err.message || 'Could not load messages');
            setMessages([]); // Reset messages on error to prevent crashes
        } finally {
            setLoading(false);
        }
    }, [user?._id, lastMessageCount]);
    
    // Send a message
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
                
                // Add new message to the list immediately
                setMessages(prev => {
                    const updatedMessages = [...prev, newMessage];
                    console.log('Updated messages:', updatedMessages);
                    return updatedMessages;
                });
                
                // Update conversation in the list
                setConversations(prev => prev.map(conv => 
                    conv.user._id === selectedConversation.user._id
                        ? { ...conv, lastMessage: newMessage }
                        : conv
                ));
                  // Tạo một bản sao của messages cục bộ để tránh re-render không cần thiết
                const updatedMessages = [...messages, newMessage];
                setMessages(updatedMessages);
                  // Update conversation in state while preserving unreadCount (don't reset)
                setConversations(prev => prev.map(conv => {
                    if (conv.user._id === selectedConversation.user._id) {
                        // Keep unreadCount the same when updating lastMessage
                        // When sending a message in an active conversation, unreadCount should be 0
                        return { 
                            ...conv, 
                            lastMessage: newMessage,
                            unreadCount: 0, // Explicitly set to 0 for active conversation 
                        };
                    }
                    return conv;
                }));
                
                // Schedule a refresh to update new messages from others
                setTimeout(() => {
                    // Use the special function to update conversations without affecting unreadCount
                    fetchConversationsWithoutResetUnread();
                }, 1000);
                
                return newMessage;
            } else {
                console.error('Failed to process message from response:', response);
                console.error('Response structure:', JSON.stringify(response, null, 2));
                
                // Check if there's an error in the response
                if (response?.error || response?.data?.error) {
                    throw new Error(`Server error: ${JSON.stringify(response.error || response.data.error)}`);
                }
                
                throw new Error('Invalid response from server');
            }
        } catch (err: any) {
            console.error('Full error object:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || err.message || 'Could not send message');
            throw err;
        }
    }, [user?._id, selectedConversation, messages, fetchConversationsWithoutResetUnread]);
    
    // Add a function to mark messages as read
    const markMessagesAsRead = useCallback(async (conversationId: string) => {
        if (!user) return;
        
        try {
            console.log('Calling markAsRead API for conversationId:', conversationId);
            const response = await chatApi.markAsRead(conversationId);
            
            // Log the server response for debugging
            console.log('markAsRead API response:', response?.data);
            
            // Update the local conversations state to reflect messages are read
            setConversations(prevConversations => 
                prevConversations.map(conv => {
                    if (conv.user._id === conversationId) {
                        const updatedConversation = { ...conv, unreadCount: 0 };
                        console.log('Updated conversation unreadCount to 0:', updatedConversation.user.user_name || updatedConversation.user.username);
                        return updatedConversation;
                    }
                    return conv;
                })
            );
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }, [user]);    // Update the selectConversation function to mark messages as read
    const selectConversation = useCallback(async (conversation: Conversation) => {
        console.log('Selecting conversation with:', {
            user: conversation.user.user_name || conversation.user.username,
            unreadCount: conversation.unreadCount
        });
        
        // Update UI state immediately
        if (conversation.unreadCount > 0) {
            console.log('Conversation has unread messages, updating UI immediately');
            
            // Update main React state
            setConversations(prevConversations => 
                prevConversations.map(conv => 
                    conv.user._id === conversation.user._id 
                        ? { ...conv, unreadCount: 0 } 
                        : conv
                )
            );
            
            // Create a copy of conversation with unreadCount = 0
            const updatedConversation = { 
                ...conversation, 
                unreadCount: 0 
            };
            setSelectedConversation(updatedConversation);
        } else {
            setSelectedConversation(conversation);
        }
        
        setLoading(true);
        setError(null);
        
        try {
            if (!user?._id) {
                throw new Error("User not authenticated");
            }
            
            // Fetch messages
            const response = await chatApi.getConversation(user._id, conversation.user._id);
            console.log('Conversation messages:', response);
            
            if (response.data?.status === 'success') {
                setMessages(response.data.data.messages || []);
                
                // Mark messages as read in backend
                if (conversation.unreadCount > 0) {
                    console.log('Calling markMessagesAsRead for', conversation.user.user_name || conversation.user.username);
                    markMessagesAsRead(conversation.user._id);
                }
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
            setError('Không thể tải tin nhắn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, [user, markMessagesAsRead, setConversations]);
    
    // Select conversation by matchId
    const selectConversationByMatchId = useCallback((matchId: string) => {
        const conversation = conversations.find(conv => conv.matchId === matchId);
        if (conversation) {
            selectConversation(conversation);
            return true;
        }
        return false;
    }, [conversations, selectConversation]);
    
    // Clear alerts after some time
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
    }, [selectedConversation, fetchMessages, fetchConversations]);
      // Load conversation list when component mounts and periodically refresh
    useEffect(() => {
        // Initial fetch
        fetchConversations();
        
        // Set up periodic refresh to check for new messages
        const intervalId = setInterval(() => {
            if (selectedConversation) {
                // Use the special function to keep unreadCount=0 for selected conversation
                fetchConversationsWithoutResetUnread();
            } else {
                // Regular fetch if no conversation is selected
                fetchConversations();
            }
        }, 30000); // Refresh every 30 seconds
        
        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [fetchConversations, fetchConversationsWithoutResetUnread, selectedConversation]);
    
    const createNewConversation = useCallback(async (userId: string, matchId: string) => {
        if (!user) return;
        
        try {
            console.log('Creating new conversation:', { userId, matchId });
            
            // Gọi API để tạo conversation mới hoặc lấy conversation hiện có
            const response = await chatApi.getConversation(user._id, userId);
            
            console.log('Create conversation response:', response);
            
            if (response.data?.status === 'success') {
              const messages = response.data.data.messages || [];
              
              // Fetch user info để có thông tin đầy đủ
              let userInfo = {
                _id: userId,
                user_name: 'New Match',
                profile_picture: null
              };
              
              // Try to get user info from existing conversations or from messages
              if (messages.length > 0) {
                const sampleMessage = messages[0];
                if (sampleMessage.sender === userId) {
                  // Get sender info
                  userInfo = {
                    _id: userId,
                    user_name: sampleMessage.senderInfo?.user_name || sampleMessage.senderInfo?.username || 'New Match',
                    profile_picture: sampleMessage.senderInfo?.profile_picture || null
                  };
                }
              }
              
              const newConversation: Conversation = {
                matchId: matchId,
                user: userInfo,
                lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
                unreadCount: 0,
                matchDate: new Date().toISOString()
              };
              
              // Thêm vào danh sách conversations nếu chưa có
              setConversations(prev => {
                const exists = prev.find(conv => conv.user._id === userId);
                if (exists) {
                  console.log('Conversation already exists, selecting existing one');
                  return prev;
                }
                console.log('Adding new conversation to list');
                return [newConversation, ...prev];
              });
              
              // Chọn conversation mới
              console.log('Selecting new conversation');
              setSelectedConversation(newConversation);
              setMessages(messages);
              
              // Clear sessionStorage
              sessionStorage.removeItem('activeMatchId');
              sessionStorage.removeItem('matchedUserId');
              
              console.log('New conversation created and selected successfully');
              return true;
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            return false;
        }
    }, [user, setMessages, setSelectedConversation, setConversations]);

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    error,
    fetchConversations,
    fetchMessages,        
    sendMessage,
    selectConversation,
    selectConversationByMatchId,
    setError,
    refreshCurrentConversation,
    newMessageAlert,
    setNewMessageAlert,
    clearAlert,
    markMessagesAsRead, // Export the new function
    createNewConversation,
  };
};