import { Bell, Heart, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import avatarPlaceholder from '../../assets/avatar_holder.png';

export interface SwipeNotification {
  id: string;
  type: 'like' | 'superlike' | 'match';
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  read: boolean;
}

interface SwipeNotificationsProps {
  notifications: SwipeNotification[];
  onMarkAsRead: (id: string) => void;
}

const SwipeNotifications: React.FC<SwipeNotificationsProps> = ({ 
  notifications,
  onMarkAsRead
}) => {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Bell className="mx-auto mb-2" size={20} />
        <p>Không có thông báo mới</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-700">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-3 hover:bg-gray-700 transition-colors ${notification.read ? 'opacity-70' : 'bg-gray-800'}`}
          onClick={() => onMarkAsRead(notification.id)}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="relative">
                {notification.senderAvatar ? (
                  <img 
                    src={notification.senderAvatar} 
                    alt={notification.senderName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-300" />
                  </div>
                )}
                
                <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
                  <Heart size={10} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <Link 
                  to={`/profile/${notification.senderId}`}
                  className="font-medium text-white hover:underline"
                >
                  {notification.senderName}
                </Link>
                <span className="text-xs text-gray-400">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-300">
                {notification.type === 'like' && 'đã thích hồ sơ của bạn'}
                {notification.type === 'superlike' && 'đã tim bạn'}
                {notification.type === 'match' && "Đã ghép đôi với bạn! Hai bạn giờ có thể trò chuyện với nhau."}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SwipeNotifications;
