import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { SwipeNotification } from '../components/notifications/SwipeNotifications';
import { useAuth } from '../hooks/useAuth';

interface NotificationContextType {
  swipeNotifications: SwipeNotification[];
  addSwipeNotification: (notification: Omit<SwipeNotification, 'id' | 'timestamp' | 'read'>) => void;
  markSwipeNotificationAsRead: (id: string) => void;
  clearSwipeNotifications: () => void;
  unreadSwipeCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [swipeNotifications, setSwipeNotifications] = useState<SwipeNotification[]>([]);
  
  // Load notifications from local storage when the component mounts
  useEffect(() => {
    // Only load notifications if user is available
    if (user?._id) {
      const storedNotifications = localStorage.getItem(`swipeNotifications_${user._id}`);
      if (storedNotifications) {
        try {
          const parsedNotifications = JSON.parse(storedNotifications);
          setSwipeNotifications(parsedNotifications);
        } catch (error) {
          console.error('Failed to parse stored notifications:', error);
        }
      }
    } else {
      // Reset notifications when user is not available
      setSwipeNotifications([]);
    }
  }, [user?._id]);
  
  // Save notifications to local storage whenever they change
  useEffect(() => {
    if (user?._id && swipeNotifications.length > 0) {
      localStorage.setItem(
        `swipeNotifications_${user._id}`,
        JSON.stringify(swipeNotifications)
      );
    }
  }, [swipeNotifications, user?._id]);
  
  const addSwipeNotification = (notification: Omit<SwipeNotification, 'id' | 'timestamp' | 'read'>) => {
    // Only add notification if user is available
    if (!user?._id) return;
    
    const newNotification: SwipeNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    
    setSwipeNotifications(prev => [newNotification, ...prev]);
  };
  
  const markSwipeNotificationAsRead = (id: string) => {
    setSwipeNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const clearSwipeNotifications = () => {
    setSwipeNotifications([]);
    if (user?._id) {
      localStorage.removeItem(`swipeNotifications_${user._id}`);
    }
  };
  
  const unreadSwipeCount = swipeNotifications.filter(n => !n.read).length;
  
  const value = {
    swipeNotifications,
    addSwipeNotification,
    markSwipeNotificationAsRead,
    clearSwipeNotifications,
    unreadSwipeCount,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
