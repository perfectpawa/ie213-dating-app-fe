import { apiRequest } from '../utils/apiRequest';

export interface ChatMessage {
  _id: string;
  sender: {
    _id: string;
    user_name: string;
    profile_picture?: string;
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
    username: string;
    email: string;
    profile?: {
      full_name?: string;
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

export const chatApi = {  // Get all conversations for a user
  getConversations: async (userId: string) => {
    const response = await apiRequest<any>(`/messages/conversations?userId=${userId}`, {
      method: 'GET'
    });
    return response;
  },
  // Get messages between two users
  getConversation: async (userId: string, otherUserId: string) => {
    const response = await apiRequest<any>(`/messages/conversations/${otherUserId}?userId=${userId}`, {
      method: 'GET'
    });
    return response;
  },
  // Send a message
  sendMessage: async (receiverId: string, content: string) => {
    const response = await apiRequest<any>('/messages', {
      method: 'POST',
      data: {
        receiverId,
        content
      }
    });
    return response;
  }
};
