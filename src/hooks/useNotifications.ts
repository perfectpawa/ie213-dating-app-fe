import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';
import { socketService } from '../services/socketService';
import { useAuth } from './useAuth';

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
    type: 'like' | 'message' | 'swipe' | 'match';
    post?: {
        _id: string;
        image: string;
    };
    read: boolean;
    createdAt: string;
}

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        console.log('useNotifications: Fetching notifications');
        try {
            setLoading(true);
            setError(null);
            const response = await notificationApi.getNotifications();
            // console.log('useNotifications: API response:', response);
            if (response?.data?.notifications) {
                // console.log('useNotifications: Setting notifications:', response.data.notifications);
                setNotifications(response.data.notifications);
            }
        } catch (err) {
            console.error('useNotifications: Error fetching notifications:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        // console.log('useNotifications: Fetching unread count');
        try {
            const response = await notificationApi.getUnreadCount();
            // console.log('useNotifications: Unread count response:', response);
            if (response?.data?.count !== undefined) {
                // console.log('useNotifications: Setting unread count:', response.data.count);
                setUnreadCount(response.data.count);
            }
        } catch (err) {
            console.error('useNotifications: Error fetching unread count:', err);
        }
    }, []);

    const markAsRead = async (notificationIds: string[]) => {
        // console.log('useNotifications: Marking notifications as read:', notificationIds);
        try {
            await notificationApi.markAsRead(notificationIds);
            setNotifications(prevNotifications => {
                const updated = prevNotifications.map(notification =>
                    notificationIds.includes(notification._id)
                        ? { ...notification, read: true }
                        : notification
                );
                // console.log('useNotifications: Updated notifications after mark as read:', updated);
                return updated;
            });
            await fetchUnreadCount();
        } catch (err) {
            console.error('useNotifications: Error marking notifications as read:', err);
            setError(err instanceof Error ? err.message : 'Failed to mark notifications as read');
            throw err;
        }
    };

    const markAllAsRead = async () => {
        // console.log('useNotifications: Marking all notifications as read');
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prevNotifications => {
                const updated = prevNotifications.map(notification => ({ ...notification, read: true }));
                // console.log('useNotifications: Updated notifications after mark all as read:', updated);
                return updated;
            });
            setUnreadCount(0);
        } catch (err) {
            console.error('useNotifications: Error marking all notifications as read:', err);
            setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
            throw err;
        }
    };

    // Handle real-time notifications
    useEffect(() => {
        // console.log('useNotifications: Setting up real-time notifications for user:', user?._id);
        
        if (!user?._id) {
            console.log('useNotifications: No user ID, skipping setup socket');
            return;
        }

        // Connect to socket
        socketService.connect(user._id);

        // Listen for new notifications
        const handleNewNotification = (notification: Notification) => {
            // console.log('useNotifications: Received new notification:', notification);
            setNotifications(prev => {
                // Check if notification already exists
                const exists = prev.some(n => n._id === notification._id);
                if (exists) {
                    // console.log('useNotifications: Notification already exists, skipping');
                    return prev;
                }
                // Add new notification to the beginning of the list
                const updated = [notification, ...prev];
                // console.log('useNotifications: Updated notifications with new notification:', updated);
                return updated;
            });
            setUnreadCount(prev => {
                const newCount = prev + 1;
                // console.log('useNotifications: Updated unread count:', newCount);
                return newCount;
            });
        };

        // Set up socket listener
        socketService.onNotification(handleNewNotification);

        // Initial fetch
        console.log('useNotifications: Performing initial fetch');
        fetchNotifications();
        fetchUnreadCount();

        // Cleanup
        return () => {
            console.log('useNotifications: Cleaning up notification listeners');
            socketService.offNotification(handleNewNotification);
            socketService.disconnect();
        };
    }, [user?._id, fetchNotifications, fetchUnreadCount]);

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