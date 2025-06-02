import Layout from "../components/layout/layout";
import { Feed } from "../components/Feed";
import { FeaturedProfiles } from "../components/FeaturedProfiles";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        {/* Welcome Banner - Thêm một banner chào mừng */}
        <div className="bg-gradient-to-r from-[#1a3f3e] to-gray-800 rounded-2xl p-6 mb-6 shadow-lg hidden sm:block">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Chào mừng đến với{" "}
                <span className="text-[#4edcd8]">FAVOR</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Kết nối, chia sẻ và tìm kiếm người đặc biệt của bạn
              </p>
            </div>
            <Link to="/discover">
              <button className="px-4 py-2 bg-[#4edcd8] hover:bg-[#3bc0bd] text-white rounded-lg transition-all">
                Khám phá ngay
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Content Feed */}
          <section className="md:col-span-2 order-2 md:order-1">
            {/* Filter Controls */}
            <div className="bg-gray-800 rounded-xl p-3 mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white pl-4 py-2">Bảng tin</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full transition">
                  Mới nhất
                </button>
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full transition">
                  Phổ biến
                </button>
              </div>
            </div>

            <Feed />
          </section>

          {/* Featured Profiles - Cải thiện vị trí và thiết kế */}
          <section className="md:col-span-1 order-1 md:order-2 mb-6 md:mb-0">
            <div className="bg-gray-800 rounded-xl p-4 shadow-md max-h-screen overflow-y-auto hide-scrollbar">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                <span className="text-[#4edcd8] mr-2">●</span>
                Hồ sơ nổi bật
              </h2>
              <FeaturedProfiles />
              
              {/* Nút xem thêm hồ sơ */}
              <div className="mt-4 text-center">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition w-full">
                  Xem tất cả
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Thêm nền trang mềm mại */}
      <div className="fixed inset-0 -z-10 bg-gray-900 overflow-hidden opacity-45 hide-scrollbar">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#4edcd8_0,_transparent_25%)]"></div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-[#1a3f3e]/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/stars-pattern.png')] opacity-20"></div>
      </div>
    </Layout>
  );
};

export default Home;