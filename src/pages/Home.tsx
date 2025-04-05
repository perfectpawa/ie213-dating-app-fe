import React, { useState, useEffect } from "react";
import { User, Heart, MessageCircle } from "lucide-react";
import Layout from "../components/layout/layout";

interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  dob: {
    age: number;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

const Home = () => {
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=3&nat=us');
        const data = await response.json();
        setUsers(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="pt-6 mb-6">
          <h1 className="text-4xl font-bold mb-0 text-white">Dành cho bạn</h1>
        </section>
        
        {/* Featured Profiles */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white inline-flex items-center">
            <p className="text-[#4edcd8] mr-2" />
            Hồ Sơ Nổi Bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 py-10 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4edcd8] border-r-transparent"></div>
                <p className="text-white mt-4">Đang tải...</p>
              </div>
            ) : (
              users.map((user, index) => (
                <div key={index} className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                  <div className="h-60 bg-gray-700 relative">
                    <img 
                      src={user.picture.large} 
                      alt={`${user.name.first}'s profile`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="font-semibold text-xl text-white">
                        {user.name.first}, {user.dob.age}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {user.location.city}, {user.location.state}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Du Lịch", "Âm Nhạc", "Thể Thao", "Nghệ Thuật", "Ẩm Thực"].slice(index, index + 3).map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-[#1a3f3e] text-[#4edcd8] rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="w-full px-4 py-3 bg-[#4edcd8] text-white rounded-lg font-medium hover:bg-[#3bc0bd] transition-colors duration-300">
                      Xem Hồ Sơ
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="mb-16 bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-8 text-white text-center">Cách Thức Hoạt Động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-[#1a3f3e] rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={30} className="text-[#4edcd8]" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-white">Tạo Hồ Sơ</h3>
              <p className="text-gray-400">Tạo hồ sơ với những bức ảnh đẹp nhất và sở thích của bạn</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-[#1a3f3e] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={30} className="text-[#4edcd8]" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-white">Khám Phá Kết Nối</h3>
              <p className="text-gray-400">Duyệt qua những người phù hợp dựa trên sở thích của bạn</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-[#1a3f3e] rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={30} className="text-[#4edcd8]" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-white">Kết Nối</h3>
              <p className="text-gray-400">Bắt đầu cuộc trò chuyện và xây dựng mối quan hệ ý nghĩa</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;