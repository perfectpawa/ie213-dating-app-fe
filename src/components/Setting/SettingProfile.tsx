import React from "react";

const SettingProfile = () => {
  return (
    <div className="w-[706px]">
      <h2 className="text-[20px] font-bold mb-6 mt-6">
        Chỉnh sửa trang cá nhân
      </h2>
      <section className="bg-gray-200 rounded-xl flex items-center gap-4 p-4">
        <img
          src="https://storage.googleapis.com/a1aa/image/4e33d127-9e04-4f39-7cc5-d48c43593390.jpg"
          alt="Avatar of a dog wearing sunglasses and holding a croissant"
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          width="56"
          height="56"
        />
        <div className="flex-grow">
          <p className="font-bold text-[14px] leading-tight mb-1">tenfukku</p>
          <p className="text-[14px] text-gray-500 leading-tight">
            Đỗ Nguyễn Thiên Phúc
          </p>
        </div>
        <button
          type="button"
          className="bg-[#0095f6] text-white font-bold text-[14px] px-4 py-2 rounded-lg flex-shrink-0"
        >
          Đổi ảnh
        </button>
      </section>

      <form className="mt-8">
        <label className="block font-bold text-[16px] mb-2">Trang web</label>
        <input
          id="website"
          name="website"
          type="text"
          placeholder="Trang web"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[16px] placeholder-gray-400 focus:outline-none focus:outline-[#0095f6]"
        />
        <p className="text-gray-500 text-[12px] mt-1 mb-6">
          Bạn chỉ có thể chỉnh sửa liên kết trên di động. Hãy mở ứng dụng
          Instagram và chỉnh sửa trang cá nhân của bạn để thay đổi trang web
          trong phần tiểu sử.
        </p>

        <label className="block font-bold text-[16px] mb-2">Tiểu sử</label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Tôi đã từng..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[16px] resize-none focus:outline-none focus:outline-[#0095f6]"
        ></textarea>
        <p className="text-gray-500 text-[12px] text-right mt-1 mb-6">
          25 / 150
        </p>

        <label className="block font-bold text-[16px] mb-2">Giới tính</label>
        <select
          id="gender"
          name="gender"
          aria-label="Giới tính"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[16px] focus:outline-none focus:outline-[#0095f6]"
        >
          <option>Nam</option>
          <option>Nữ</option>
        </select>
        <p className="text-gray-500 text-[12px] mt-1">
          Thông tin này sẽ không xuất hiện trên trang cá nhân công khai của bạn.
        </p>
      </form>
      <button
        type="button"
        className="bg-[#0095f6] text-white font-bold text-[14px] px-4 py-2 rounded-lg flex-shrink-0 mt-6 justify-right w-full"
      >
        Lưu
      </button>
    </div>
  );
};
export default SettingProfile;
