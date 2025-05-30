import React, {useState, useEffect} from "react";

interface NotificationModal {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: 'like' | 'message' | 'swipe' | 'match';
  time: string;
  read: boolean;
}

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationModal[];
  onViewAll?: () => void;
  onNotificationClick?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationModal: React.FC<NotificationProps> = ({ 
  isOpen, 
  onClose,
  notifications = [],
  onViewAll,
  onNotificationClick,
  onMarkAllAsRead
}) => {
  // Create a local state copy of notifications to manage read status
  const [localNotifications, setLocalNotifications] = useState<NotificationModal[]>([]);
  
  // Initialize local notifications when props change
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const getNotificationText = (type: NotificationModal['type']) => {
    switch (type) {
      case 'like':
        return 'liked your post';
      case 'message':
        return 'sent you a message';
      case 'swipe':
        return 'swiped on your profile';
      case 'match':
        return 'matched with you';
      default:
        return 'interacted with you';
    }
  };

  const handleMarkAllAsRead = async () => {
    if (onMarkAllAsRead) {
      await onMarkAllAsRead();
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    if (onNotificationClick) {
      await onNotificationClick(notificationId);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute z-300 right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
      <div className="px-3 py-2 border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-lg text-white pl-1">Notifications</h3>
        <button 
          className="text-gray-400 text-[12px] hover:text-[#4edcd8] cursor-pointer"
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      
      <div className="px-4 py-1 border-b border-gray-700 flex flex-row items-center">
        <div className="flex gap-6 pb-1">
          <button 
            className="pl-1 cursor-pointer hover:text-[#4edcd8] font-semibold text-white text-xs flex items-center gap-1"
            onClick={handleMarkAllAsRead}
          > 
            All
          </button>
          <button 
            className="cursor-pointer hover:text-[#4edcd8] font-semibold text-white text-xs flex items-center gap-1"
            onClick={handleMarkAllAsRead}
          > 
            Read
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No new notifications
          </div>
        ) : (
          localNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`py-3 px-4 hover:bg-gray-700 border-b border-gray-700 cursor-pointer transition-all duration-200 ease-in-out ${!notification.read ? 'bg-gray-700/40' : ''}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-start gap-3">
                <img 
                  src={notification.user.avatar}
                  alt={notification.user.name} 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${notification.user.name}&background=1a3f3e&color=4edcd8`;
                  }}
                />
                <div>
                  <p className="text-left text-sm text-white">
                    <span className="font-bold text-l">
                      {notification.user.name}
                    </span>{' '}
                    <span className="text-sm text-gray-100">{getNotificationText(notification.type)}</span>
                  </p>
                  <p className="text-xs text-gray-400 text-left">{notification.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-2 text-center border-t border-gray-700">
        <button 
          className="text-sm text-[#4edcd8] hover:underline w-full py-1 cursor-pointer"
          onClick={handleViewAll}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;