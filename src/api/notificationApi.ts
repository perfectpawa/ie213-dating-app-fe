import { apiRequest } from '../utils/apiRequest';

interface Notification {
    _id: string;
    notificationId: string;
    recipient: string;
    sender: {
        _id: string;
        user_name: string;
        profile_picture: string;
        full_name: string;
    };
    type: 'like' | 'message' | 'connection' | 'match';
    post?: {
        _id: string;
        image: string;
    };
    read: boolean;
    createdAt: string;
}

interface NotificationsResponse {
    status: string;
    data: {
        notifications: Notification[];
    };
}

interface UnreadCountResponse {
    status: string;
    data: {
        count: number;
    };
}

export const notificationApi = {
    getNotifications: async () => {
        const response = await apiRequest<NotificationsResponse>('/notifications', {
            method: 'GET',
        });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await apiRequest<UnreadCountResponse>('/notifications/unread-count', {
            method: 'GET',
        });
        return response.data;
    },

    markAsRead: async (notificationIds: string[]) => {
        const response = await apiRequest<void>('/notifications/mark-read', {
            method: 'POST',
            data: { notificationIds },
        });
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await apiRequest<void>('/notifications/mark-all-read', {
            method: 'POST',
        });
        return response.data;
    },
}; 