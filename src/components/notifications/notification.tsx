import React, {useState, useEffect} from "react";

interface Notification {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  type: 'like' | 'message' | 'connection' | 'match';
  time: string;
  read: boolean;
}

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  onViewAll?: () => void;
}

const NotificationModal: React.FC<NotificationProps> = ({ 
  isOpen, 
  onClose,
  notifications = [],
  onViewAll 
}) => {
  if (!isOpen) return null;

  // Create a local state copy of notifications to manage read status
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  
  // Initialize local notifications when props change
  useEffect(() => {
    const displayNotifs = notifications.length > 0 ? notifications : [
      {
        id: 1,
        user: {
          name: "Alex",
          avatar: "https://randomuser.me/api/portraits/men/11.jpg"
        },
        type: 'like' as const,
        time: "2 tiếng trước",
        read: false
      },
      {
        id: 2,
        user: {
          name: "Emma",
          avatar: "https://randomuser.me/api/portraits/women/12.jpg"
        },
        type: 'message' as const,
        time: "3 tiếng trước",
        read: true
      },
      {
        id: 3,
        user: {
          name: "Michael",
          avatar: "https://randomuser.me/api/portraits/men/13.jpg"
        },
        type: 'connection' as const,
        time: "5 tiếng trước",
        read: false
      }
    ];
    setLocalNotifications(displayNotifs);
  }, [notifications]);

  const getNotificationText = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return 'đã thích hồ sơ của bạn';
      case 'message':
        return 'đã gửi tin nhắn cho bạn';
      case 'connection':
        return 'đang kết nối với bạn';
      case 'match':
        return 'đã ghép đôi với bạn';
      default:
        return 'đã tương tác với bạn';
    }
  };

  const markallAsRead = () => {
    // Create a new array with all notifications marked as read
    const updatedNotifications = localNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    // Update the state to trigger re-render
    setLocalNotifications(updatedNotifications);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
      <div className="px-3 py-2 border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-lg text-white pl-1">Thông báo</h3>
        <button 
          className="text-gray-400 text-[12px] hover:text-[#4edcd8] cursor-pointer"
          onClick={markallAsRead}
        > Đánh dấu tất cả là đã đọc
        </button>
      </div>
      
      <div className="px-4 py-1 border-b border-gray-700 flex flex-row items-center">
        <div className="flex gap-6 pb-1">
          <button 
        className="pl-1 cursor-pointer hover:text-[#4edcd8] font-semibold text-white text-xs flex items-center gap-1"
        onClick={markallAsRead}
          > 
        Tất cả
          </button>
          <button 
        className="cursor-pointer hover:text-[#4edcd8] font-semibold text-white text-xs flex items-center gap-1"
        onClick={markallAsRead}
          > 
        Đã đọc
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            Không có thông báo mới
          </div>
        ) : (
          localNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`py-3 px-4 hover:bg-gray-700 border-b border-gray-700 cursor-pointer transition-all duration-200 ease-in-out ${!notification.read ? 'bg-gray-700/40' : ''}`}
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
                  <p className="text-sm text-white">
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
          Hiện tất cả thông báo
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;