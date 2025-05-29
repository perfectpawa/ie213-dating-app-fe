import { Bell } from "lucide-react";
import NotificationModal from "../Modal/NotificationModal.tsx";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationBellProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NotificationBell = ({ isOpen, onToggle }: NotificationBellProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleViewAllNotifications = () => {
    console.log("View all notifications clicked");
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markAsRead([notificationId]);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <div 
        className="relative cursor-pointer"
        onClick={onToggle}
      >
        <Bell size={24} className="text-gray-300 hover:text-[#4edcd8]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      
      <NotificationModal 
        isOpen={isOpen} 
        onClose={onToggle}
        onViewAll={handleViewAllNotifications}
        notifications={notifications.map(notification => ({
          id: notification._id,
          user: {
            name: notification.sender.user_name || notification.sender.full_name || 'Anonymous',
            avatar: notification.sender.profile_picture || `https://ui-avatars.com/api/?name=${notification.sender.user_name || notification.sender.full_name}&background=1a3f3e&color=4edcd8`
          },
          type: notification.type,
          time: new Date(notification.createdAt).toLocaleString(),
          read: notification.read
        }))}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
};

export default NotificationBell; 