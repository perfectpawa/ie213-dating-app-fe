import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';

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

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationApi.getNotifications();
            setNotifications(response.data.notifications);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationApi.getUnreadCount();
            setUnreadCount(response.data.count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const markAsRead = async (notificationIds: string[]) => {
        try {
            await notificationApi.markAsRead(notificationIds);
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notificationIds.includes(notification._id)
                        ? { ...notification, read: true }
                        : notification
                )
            );
            await fetchUnreadCount();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark notifications as read');
            throw err;
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, read: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
            throw err;
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
    };
}; 