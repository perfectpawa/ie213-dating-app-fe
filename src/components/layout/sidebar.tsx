import React, { useState, useEffect } from "react";
import { Home, Menu, User, Heart, MessageCircle, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { useModal } from "@/contexts/ModalContext";

interface NavItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed, onClick }) => {
  const content = (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 text-white group transition-transform duration-300 hover:scale-105">
      <div className="text-[#4edcd8] mr-1 min-w-5 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isCollapsed ? 'w-0' : 'w-auto'}`}>
        <span className={`cursor-pointer text-sm whitespace-nowrap transition-all duration-700 ${isCollapsed ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          {label}
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return <li onClick={onClick}>{content}</li>;
  }

  return (
    <li>
      <Link to={to!}>{content}</Link>
    </li>
  );
};

interface FooterProps {
  isCollapsed: boolean;
}

const Footer: React.FC<FooterProps> = ({ isCollapsed }) => (
  <div className={`mt-auto pt-4 border-t border-gray-800 transition-all duration-700 ease-in-out ${isCollapsed ? 'opacity-0 h-0 border-opacity-0 overflow-hidden' : 'opacity-100 border-opacity-100'}`}>
    <div className={`transition-all duration-700 ease-in-out transform ${isCollapsed ? '-translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
      {/* App Store Links */}
      <div className="flex gap-2 mb-4 justify-center">
        <a href="https://github.com/perfectpawa/ie213-dating-app-fe" target="_blank" rel="noopener noreferrer" className="bg-gray-800 rounded-full p-2 w-10 h-10 flex items-center justify-center">
          <img src="https://images.icon-icons.com/2351/PNG/512/logo_github_icon_143196.png" alt="Github" className="w-full h-full white object-cover" />
        </a>
      </div>
      
      <div className="px-2 text-center">
        <button className="text-white px-4 py-1 rounded-lg border border-gray-700 text-sm mb-3">
          Tiếng Việt
        </button>
        <p className="text-teal-500 text-xs mb-2">
          Chúng tôi đại diện cho tình yêu. ❤️
        </p>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {/* <span>Điều...</span>
          <span>Quyền...</span>
          <span>Hỗi...</span>
          <span>Mẹo An...</span> */}
        </div>
        <p className="text-xs text-gray-500">© 2025 Favor Enterprises, Inc.</p>
      </div>
    </div>
  </div>
);

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { openCreatePostModal } = useModal();
  // Thêm state để kiểm soát hiển thị sidebar trên mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // UseEffect để tự động collapse sidebar trên màn hình nhỏ
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    handleResize(); // Kiểm tra lúc init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { to: "/", icon: <Home size={20} />, label: "Trang chủ" },
    { to: "/discover", icon: <Heart size={20} />, label: "Khám phá" },
    { to: "/messages", icon: <MessageCircle size={20} />, label: "Tin nhắn" },
    { to: "/profile", icon: <User size={20} />, label: "Hồ sơ" },
    { 
      icon: <PlusCircle size={20} />, 
      label: "Đăng ảnh mới",
      onClick: () => openCreatePostModal()
    },
  ];

  return (
    <>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      <aside 
        className={`fixed md:relative bg-gray-900 shadow-md h-screen transition-all duration-300 z-20
          ${isCollapsed ? 'w-16' : 'w-48 sm:w-56 md:w-64'}
          ${isMobileMenuOpen ? 'left-0' : '-left-full md:left-0'}`}
      >
        <div className="p-3 sm:p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 ml-0.5">
            <button 
              className="bg-gray-800 rounded-full p-1 z-10"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu size={24} className="cursor-pointer text-gray-300 hover:text-[#4edcd8]" />
            </button>
            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isCollapsed ? 'w-0' : 'w-auto'}`}>
              <span className={`text-lg sm:text-xl font-bold text-[#4edcd8] whitespace-nowrap transition-all duration-700 ${isCollapsed ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                <img src="/icon.png" alt="Logo" className="inline-block h-6 w-6 mr-1" />
                 FAVOR
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 flex-grow">
            <ul className="space-y-1 sm:space-y-2">
              {navigationItems.map((item, index) => (
                <NavItem
                  key={item.to || `action-${index}`}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isCollapsed={isCollapsed}
                  onClick={item.onClick}
                />
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <Footer isCollapsed={isCollapsed} />
        </div>
      </aside>
      
      {/* Mobile menu toggle button - hiển thị ở navbar trên mobile */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-gray-800 rounded-full p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={24} className="text-gray-300" />
      </button>
    </>
  );
};

export default Sidebar;