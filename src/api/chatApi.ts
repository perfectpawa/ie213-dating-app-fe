import { apiRequest } from '../utils/apiRequest';

export interface ChatMessage {
  _id: string;
  sender: {
    _id: string;
    user_name?: string;
    full_name?: string;
    username?: string;
    profile_picture?: string;
    profile?: {
      full_name?: string;
      user_name?: string;
      profile_picture?: string;
    };
  };
  receiver: string;
  content: string;
  timestamp: string;
  createdAt: string;
}

export interface Conversation {
  matchId: string;
  user: {
    _id: string;
    user_name?: string;
    full_name?: string; 
    username: string;
    email: string;
    profile_picture?: string;
    profile?: {
      full_name?: string;
      user_name?: string;
      profile_picture?: string;
    };
  };
  lastMessage?: ChatMessage;
  unreadCount: number;
  matchDate: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface MessagesResponse {
  messages: ChatMessage[];
}

export const chatApi = {
  // Get all conversations for a user
  getConversations: async (userId: string) => {
    console.log('Fetching conversations for userId:', userId);
    
    const response = await apiRequest<any>(`/messages/conversations?userId=${userId}`, {
      method: 'GET'
    });
    
    // Log conversation data for debugging
    console.log('Raw conversation data response:', response);
    
    // Check if conversations exist in response
    if (response?.data?.data?.conversations) {
      console.log('Found conversations:', response.data.data.conversations.length);
      
      // Debug first conversation user data if available
      if (response.data.data.conversations.length > 0) {
        const firstConv = response.data.data.conversations[0];
        console.log('First conversation user data:', {
          user_id: firstConv.user?._id,
          username: firstConv.user?.username,
          user_name: firstConv.user?.user_name,
          profile_picture: firstConv.user?.profile_picture,
          profile: firstConv.user?.profile
        });
      }
    } else {
      console.warn('No conversations found in response');
    }
    
    // Check user data structure in each conversation
    if (response?.data?.data?.conversations) {
      response.data.data.conversations.forEach((conv: any) => {
        console.log(`User data for ${conv.user?.username || 'unknown'}:`, conv.user);
      });
    }
    
    return response;
  },  // Get messages between two users
  getConversation: async (userId: string, otherUserId: string) => {
    console.log(`Fetching conversation between ${userId} and ${otherUserId}`);
    
    const response = await apiRequest<any>(`/messages/conversations/${otherUserId}?userId=${userId}`, {
      method: 'GET'
    });
    
    console.log('Conversation response:', response);
    
    // Debug sender information in messages
    if (response?.data?.data?.messages?.length > 0) {
      const firstMessage = response.data.data.messages[0];
      console.log('First message sender:', firstMessage.sender);
    }
    
    return response;
  },  // Send a message
  sendMessage: async (receiverId: string, content: string) => {
    const response = await apiRequest<any>('/messages', {
      method: 'POST',
      data: {
        receiverId,
        content
      }
    });
    return response;
  },
    // Mark messages as read
  markAsRead: async (otherUserId: string) => {
    console.log('Marking messages from user as read:', otherUserId);
    
    try {
      const response = await apiRequest<any>('/messages/mark-read', {
        method: 'POST',
        data: {
          otherUserId
        }
      });
      
      console.log('Mark as read response:', response?.data);
      return response;
    } catch (error) {
      console.error('Error in markAsRead API call:', error);
      throw error;
    }
  }
};
