import React from "react";

const SettingPrivate = () => {
  return (
    <div className="bg-black text-white w-[706px] mx-auto text-left">
      <h1 className="text-[20px] font-bold mb-6">
        Quyền riêng tư của tài khoản
      </h1>
      <div className="flex items-center justify-between border border-gray-300 rounded-2xl px-5 py-3 mb-4 max-w-3xl">
        <span className="text-[16px] leading-[18px] font-normal">
          Tài khoản riêng tư
        </span>
        <label className="relative inline-block w-10 h-5 cursor-pointer">
          <input
            type="checkbox"
            id="toggle"
            className="opacity-0 w-0 h-0 peer"
            aria-checked="false"
          />
          <span className="absolute left-0 top-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-[#3897f0]"></span>
          <span className="absolute left-[2px] top-[2px] w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
        </label>
      </div>
      <p className="text-[12px] leading-4 text-[#8e8e8e] mb-2">
        Khi bạn đặt tài khoản ở chế độ công khai, bất cứ ai trên hoặc ngoài
        Instagram cũng có thể xem trang cá nhân và bài viết của bạn, ngay cả khi
        họ không có tài khoản Instagram.
      </p>
      <p className="text-[12px] leading-4 text-[#8e8e8e]">
        Khi bạn đặt tài khoản ở chế độ riêng tư, chỉ những người theo dõi mà bạn
        phê duyệt mới có thể xem những gì bạn chia sẻ (bao gồm cả ảnh/video trên
        trang vị trí và hashtag) cũng như danh sách người theo dõi và đang theo
        dõi. Một số thông tin trên trang cá nhân của bạn (chẳng hạn như ảnh đại
        diện và tên người dùng) sẽ hiển thị với bất kỳ ai trên và ngoài
        Instagram.{" "}
        <a href="#" className="font-semibold text-[#262626] hover:underline">
          Tìm hiểu thêm
        </a>
      </p>
    </div>
  );
};
export default SettingPrivate;
