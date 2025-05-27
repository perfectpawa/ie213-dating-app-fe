import { useState } from "react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Center - Search */}
          <SearchBar />

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationBell 
              isOpen={showNotifications}
              onToggle={() => setShowNotifications(!showNotifications)}
            />
            
            {/* User profile */}
            <ProfileDropdown 
              isOpen={showProfileDropdown}
              onToggle={() => setShowProfileDropdown(!showProfileDropdown)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 