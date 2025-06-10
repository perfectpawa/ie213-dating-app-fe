// filepath: ie213-dating-app-fe/src/api/botApi.ts
import { apiRequest } from '../utils/apiRequest';

export const botApi = {
  sendMessage: async (message: string) => {
    try {
      console.log("Sending message to API:", message);
      // Bỏ /api prefix vì apiRequest đã thêm nó
      return await apiRequest('/v1/bot/send', {
        method: 'POST',
        data: { message }
      });
    } catch (error) {
      console.error("Error in botApi.sendMessage:", error);
      throw error;
    }
  },
  
  getConversation: async () => {
    try {
      console.log("Fetching conversation history");
      // Bỏ /api prefix vì apiRequest đã thêm nó
      return await apiRequest('/v1/bot/conversation', {
        method: 'GET'
      });
    } catch (error) {
      console.error("Error in botApi.getConversation:", error);
      throw error;
    }
  }
};