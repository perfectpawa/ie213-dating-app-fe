import React, { useState } from "react";
import { Search, Menu, Bell, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 shadow-md w-full">
      
      {/* Center section: Thanh tìm kiếm */}
      <div className="hidden md:block flex-1 max-w-md mx-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for people, interests..."
            className="w-full py-2 px-4 pl-10 bg-gray-800 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4edcd8]"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Right section: Thông báo và hồ sơ người dùng */}
      <div className="flex items-center gap-4">
        {/* Mobile search icon */}
        <Search size={24} className="cursor-pointer md:hidden text-gray-300 hover:text-[#4edcd8]" />
        
        {/* Notifications */}
        <div className="relative">
          <div 
            className="relative cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={24} className="text-gray-300 hover:text-[#4edcd8]" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </div>
          
          {/* Dropdown for notifications */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
              <div className="p-3 border-b border-gray-700">
                <h3 className="font-semibold text-white">Thông báo</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-3 hover:bg-gray-700 border-b border-gray-700 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <img 
                        src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 10}.jpg`}
                        alt="User" 
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=User&background=1a3f3e&color=4edcd8`;
                        }}
                      />
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-semibold">
                            {["Alex", "Emma", "Michael"][item-1]}
                          </span> {["đã thích hồ sơ của bạn", "đã gửi tin nhắn cho bạn", "đang kết nối với bạn"][item-1]}
                        </p>
                        <p className="text-xs text-gray-400 text-left">2 tiếng trước</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t border-gray-700">
                <button className="text-sm text-[#4edcd8] hover:underline mr-0.25">Hiện tất cả tin nhắn</button>
              </div>
            </div>
          )}
        </div>
        
        {/* User profile */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#4edcd8] ring-2 ring-gray-800">
              <img 
                src="https://avatars.githubusercontent.com/u/36991471?v=4" 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://ui-avatars.com/api/?name=Nam+Chill&background=1a3f3e&color=4edcd8`;
                }}
              />
            </div>
            <span className="hidden md:block text-sm font-medium text-white">Nam Chill</span>
            <ChevronDown size={16} className="text-gray-300" />
          </div>
          
          {/* Profile dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 text-sm text-white">
                Hồ sơ của tôi
              </Link>
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 text-sm text-white">
                Cài đặt
              </Link>
              <div className="border-t border-gray-700"></div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-red-400">
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