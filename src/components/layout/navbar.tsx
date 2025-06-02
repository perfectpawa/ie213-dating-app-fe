import React, { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NotificationModal from "../Modal/NotificationModal.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import avatarPlaceholder from '../../assets/avatar_holder.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const handleViewAllNotifications = () => {
    console.log("View all notifications clicked");
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

  const handleNotificationClick = async (notificationId: string, status: string, postId: string, userId: string) => {
    try {
      //TODO: workind
      await markAsRead([notificationId]);
      console.log(`Notification clicked: ${notificationId}, Status: ${status}, Post ID: ${postId}, User ID: ${userId}`);

      if (status === 'swipe') {
        navigate(`/profile/${userId}`);
      }

      if (status === 'match') {
        navigate(`/messages/${userId}`);
      }

    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo trên mobile */}
          <div className="flex items-center md:hidden">
            <span className="text-lg font-bold text-[#4edcd8]">
              <img src="/icon.png" alt="Logo" className="inline-block h-6 w-6 mr-1" />
              FAVOR
            </span>
          </div>

          {/* Center - Search */}
          {/* <div className="hidden md:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-[#4edcd8] focus:border-[#4edcd8] sm:text-sm"
                  placeholder="Tìm kiếm"
                  type="search"
                />
              </div>
            </div>
          </div> */}

          {/* Right side */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <div 
                className="relative cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={24} className="text-gray-300 hover:text-[#4edcd8]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <NotificationModal 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)}
                onViewAll={handleViewAllNotifications}
                notifications={notifications.map(notification => ({
                  id: notification._id,
                  user: {
                    id: notification.sender._id,
                    name: notification.sender.user_name || notification.sender.full_name || 'Anonymous',
                    avatar: notification.sender.profile_picture || `https://ui-avatars.com/api/?name=${notification.sender.user_name || notification.sender.full_name}&background=1a3f3e&color=4edcd8`
                  },
                  post: notification.post?._id,
                  swipe: notification.swipe,
                  match: notification.match,
                  type: notification.type,
                  time: new Date(notification.createdAt).toLocaleString(),
                  read: notification.read
                }))}
                onNotificationClick={handleNotificationClick}
                onMarkAllAsRead={markAllAsRead}
              />
            </div>
            
            {/* User profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex cursor-pointer items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.profile_picture || avatarPlaceholder}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <ChevronDown className="h-5 w-5 text-gray-300 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="cursor-pointer absolute z-40 right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      {/* <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            name="search-mobile"
            className="block w-full pl-10 pr-3 py-1.5 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-[#4edcd8] focus:border-[#4edcd8] text-sm"
            placeholder="Tìm kiếm"
            type="search"
          />
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;