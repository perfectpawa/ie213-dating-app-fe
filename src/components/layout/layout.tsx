import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "../navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Kiểm tra kích thước màn hình để xác định chế độ mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Kiểm tra khi component mount
    checkMobile();
    
    // Thêm event listener để theo dõi thay đổi kích thước
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Trên mobile, chỉ hiển thị Sidebar khi cần */}
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;