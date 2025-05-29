import React, { useState } from "react";
import { Search, Menu, Bell, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NotificationModal from "../notifications/notification";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../contexts/NotificationContext";
import avatarPlaceholder from '../../assets/avatar_holder.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { swipeNotifications, markSwipeNotificationAsRead, unreadSwipeCount } = useNotifications();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleViewAllNotifications = () => {
    // Logic to navigate to all notifications page would go here
    console.log("View all notifications clicked");
    // You could use react-router navigate here if you had a notifications page
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  if (!user) {
    return null;
  }
    return (
    <header className="flex justify-between items-center p-4 bg-gray-900 shadow-md w-full relative z-20">
      
      {/* Center section: Thanh tìm kiếm */}
      <div className="hidden md:block flex-1 max-w-md mx-4">
        <div className="relative">          <input 
            type="text" 
            placeholder="Tìm kiếm mọi người, sở thích..."
            className="w-full py-2 px-4 pl-10 bg-gray-800 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4edcd8]"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Right section: Thông báo và hồ sơ người dùng */}
      <div className="flex items-center gap-4">        {/* Mobile search icon */}
        <Search size={24} className="cursor-pointer md:hidden text-gray-300 hover:text-[#4edcd8]" />
        
        {/* Notifications */}
        <div className="relative">          <div 
            className="relative cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={24} className="text-gray-300 hover:text-[#4edcd8]" />
            {unreadSwipeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadSwipeCount}
              </span>
            )}
          </div>
          
          {/* Using the enhanced Notification Modal component with swipe notifications */}
          <NotificationModal 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)}
            onViewAll={handleViewAllNotifications}
            swipeNotifications={swipeNotifications}
            onMarkSwipeAsRead={markSwipeNotificationAsRead}
            notifications={[
              {
                id: 1,
                user: {
                  name: "Alex",
                  avatar: "https://randomuser.me/api/portraits/men/11.jpg"
                },
                type: 'like',
                time: "2 tiếng trước",
                read: false
              },
              {
                id: 2,
                user: {
                  name: "Emma",
                  avatar: "https://randomuser.me/api/portraits/women/12.jpg"
                },
                type: 'message',
                time: "3 tiếng trước",
                read: true
              },
              {
                id: 3,
                user: {
                  name: "Michael",
                  avatar: "https://randomuser.me/api/portraits/men/13.jpg"
                },
                type: 'connection',
                time: "5 tiếng trước",
                read: false
              }
            ]}
          />
        </div>
        
        {/* User profile */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#4edcd8] ring-2 ring-gray-800">
              <img 
                src={user.profile_picture || avatarPlaceholder}
                alt={user.user_name || 'Profile'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = avatarPlaceholder;
                }}
              />
            </div>
            <span className="hidden md:block text-sm font-medium text-white">{user.user_name}</span>
            <ChevronDown size={16} className="text-gray-300" />
          </div>
          
          {/* Profile dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 text-sm text-white">
                Hồ sơ của tôi
              </Link>
              <Link to="/setting" className="block px-4 py-2 hover:bg-gray-700 text-sm text-white">
                Cài đặt
              </Link>
              <div className="border-t border-gray-700"></div>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 hover:bg-gray-700 text-sm text-red-400 cursor-pointer text-center"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;