import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineLockPerson } from "react-icons/md";
import { BsPersonFillSlash } from "react-icons/bs";
import { LuBellRing } from "react-icons/lu";
import { HiLanguage } from "react-icons/hi2";
import { IoIosHelpBuoy } from "react-icons/io";
import { GoBlocked } from "react-icons/go";
import { LuMessageCircleHeart } from "react-icons/lu";
import { FaRegCommentAlt } from "react-icons/fa";

interface LeftSideSettingProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const LeftSideSetting: React.FC<LeftSideSettingProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="bg-black text-white w-[30%] h-screen overflow-y-auto text-left">
      <h1 className="text-[25px] font-bold mb-2">Cài đặt</h1>
      <p className="text-[13px] leading-[18px] text-gray-400 font-bold mb-2 select-none">
        Cách bạn dùng Instagram
      </p>

      <button
        className="flex items-center mb-4 rounded-sm hover:bg-[#efefef] px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none"
        type="button"
        onClick={() => setActiveTab("profile")}
      >
        <IoPersonCircleOutline className="text-2xl mr-2" />
        <span>Chỉnh sửa trang cá nhân</span>
      </button>

      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
        onClick={() => setActiveTab("")}
      >
        <LuBellRing className="text-2xl mr-2" />
        <span>Thông báo</span>
      </button>

      <p className="text-[13px] leading-[18px] text-gray-400 font-bold text-[#8e8e8e] mb-2 select-none">
        Ai có thể xem nội dung của bạn
      </p>

      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
        onClick={() => setActiveTab("private")}
      >
        <MdOutlineLockPerson className="text-2xl mr-2" />
        <span>Quyền riêng tư của tài khoản</span>
      </button>
      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
        onClick={() => setActiveTab("block")}
      >
        <GoBlocked className="text-2xl mr-2" />
        <span>Đã chặn</span>
      </button>
      <p className="text-[13px] leading-[18px] mb-2 select-none text-gray-400 font-bold">
        Cách người khác có thể tương tác với bạn
      </p>

      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
        onClick={() => setActiveTab("message")}
      >
        <LuMessageCircleHeart className="text-2xl mr-2" />
        <span>Tin nhắn và lượt phản hồi tin</span>
      </button>
      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
        onClick={() => setActiveTab("comment")}
      >
        <FaRegCommentAlt className="text-2xl mr-2" />
        <span>Bình luận</span>
      </button>
      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
      >
        <BsPersonFillSlash className="text-2xl mr-2" />
        Tài khoản bị hạn chế
      </button>
      <p className="text-[13px] leading-[18px] mb-2 select-none text-gray-400 font-bold">
        Ứng dụng và file phương tiện của bạn
      </p>

      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
      >
        <HiLanguage className="text-2xl mr-2" />
        <span>Ngôn ngữ</span>
      </button>
      <p className="text-[13px] leading-[18px] mb-2 select-none text-gray-400 font-bold">
        Thông tin khác và hỗ trợ
      </p>

      <button
        className="flex items-center mb-4 px-3 py-2 w-full text-[15px] leading-[20px] text-[#efefef] hover:text-black focus:outline-none hover:bg-[#efefef] rounded-sm"
        type="button"
      >
        <IoIosHelpBuoy className="text-2xl mr-2" />
        <span>Hỗ trợ</span>
      </button>
    </div>
  );
};
export default LeftSideSetting;
