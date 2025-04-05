import React, { useState } from "react";
import { Home, Menu, User, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <aside className={`relative bg-gray-900 shadow-md h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-48 sm:w-56 md:w-64'}`}>
      {/* Toggle button */}
     
      
      <div className="p-3 sm:p-4 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 ml-0.5">
          <button 
            className="-right-3 top-12 bg-gray-800 rounded-full p-1 z-10"
            onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? 
            <Menu size={24} className="cursor-pointer text-gray-300 hover:text-[#4edcd8]" /> : 
            <Menu size={24} className="cursor-pointer text-gray-300 hover:text-[#4edcd8]" />
            }
          </button>
          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isCollapsed ? 'w-0' : 'w-auto'}`}>
            <span className={`text-lg sm:text-xl font-bold text-[#4edcd8] whitespace-nowrap transition-all duration-700 ${isCollapsed ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>Boo</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-4 flex-grow">
          <ul className="space-y-1 sm:space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 text-white group">
                <Home size={20} className="text-[#4edcd8] mr-1 min-w-5 transition-transform duration-500 group-hover:scale-105" />
                <span className={`text-sm transition-transform duration-500 group-hover:scale-105 ${isCollapsed ? 'opacity-0 transform -translate-x-2' : 'opacity-100 transform translate-x-0'}`}>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/discover" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 text-white group">
                <Heart size={20} className="text-[#4edcd8] mr-1 min-w-5 transition-transform duration-500 group-hover:scale-105" />
                <span className={`text-sm transition-transform duration-600 group-hover:scale-105 ${isCollapsed ? 'opacity-0 transform -translate-x-2' : 'opacity-100 transform translate-x-0'}`}>Discover</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 text-white group">
                <MessageCircle size={20} className="text-[#4edcd8] mr-1 min-w-5 transition-transform duration-500 group-hover:scale-105" />
                <span className={`text-sm transition-transform duration-700 group-hover:scale-105 ${isCollapsed ? 'opacity-0 transform -translate-x-2' : 'opacity-100 transform translate-x-0'}`}>Messages</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 text-white group">
                <User size={20} className="text-[#4edcd8] mr-1 min-w-5 transition-transform duration-500 group-hover:scale-105" />
                <span className={`text-sm transition-transform duration-800 group-hover:scale-105 ${isCollapsed ? 'opacity-0 transform -translate-x-2' : 'opacity-100 transform translate-x-0'}`}>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className={`mt-auto pt-4 border-t border-gray-800 transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 transform -translate-x-2' : 'opacity-100 transform translate-x-0 relative'}`}>
          {/* App Store Links */}
          <div className="flex gap-2 mb-4 justify-center">
            <a href="#" className="bg-gray-800 rounded-full p-2 w-10 h-10 flex items-center justify-center hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </a>
            <a href="#" className="bg-gray-800 rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M9 7V2.13a4 4 0 0 1 0 7.75"/><path d="M17 17v4.87a4 4 0 0 1 0-7.75"/><path d="M12.85 17.15a5 5 0 0 0 .17-7.32 1 1 0 0 0-1.41-.12 4 4 0 0 0 0 5.66 1 1 0 0 0 1.24-.22z"/></svg>
            </a>
          </div>
          
          <div className="px-2 text-center">
            <button className="text-white px-4 py-1 rounded-lg border border-gray-700 text-sm mb-3">Tiếng Việt</button>
            <p className="text-teal-500 text-xs mb-2">Chúng tôi đại diện cho tình yêu. ❤️</p>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Điều...</span>
              <span>Quyền...</span>
              <span>Hỗi...</span>
              <span>Mẹo An...</span>
            </div>
            <p className="text-xs text-gray-500">© 2025 Boo Enterprises, Inc.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;