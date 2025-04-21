import React from "react";

const SettingComment = () => {
  return (
    <div className="w-[706px]">
      <h2 className="text-[20px] font-bold mb-6 mt-6">Bình luận</h2>
      <div
        role="radiogroup"
        aria-labelledby="comment-permission-label"
        className="mb-8"
      >
        <div
          id="comment-permission-label"
          className="font-bold text-[14px] mb-3"
        >
          Cho phép bình luận của
        </div>
        <label className="flex mb-4 cursor-pointer">
          <input
            type="radio"
            id="radio1"
            name="commentPermission"
            checked
            aria-checked="true"
          />
          <span className="ml-3 select-none">Mọi người</span>
        </label>
        <label className="flex mb-4 cursor-pointer">
          <input
            type="radio"
            id="radio2"
            name="commentPermission"
            aria-checked="false"
          />
          <div className="ml-3 select-none">
            <div>Người mà bạn theo dõi</div>
            <div className="text-xs text-[#a0a8b9] mt-[2px]">67 người</div>
          </div>
        </label>
        <label className="flex mb-4 cursor-pointer">
          <input
            type="radio"
            id="radio3"
            name="commentPermission"
            aria-checked="false"
          />
          <div className="ml-3 select-none">
            <div>Người theo dõi bạn</div>
            <div className="text-xs text-[#a0a8b9] mt-[2px]">182 người</div>
          </div>
        </label>
        <label className="flex cursor-pointer">
          <input
            type="radio"
            id="radio4"
            name="commentPermission"
            aria-checked="false"
          />
          <div className="ml-3 select-none">
            <div>Những người bạn theo dõi và những người theo dõi bạn</div>
            <div className="text-xs text-[#a0a8b9] mt-[2px]">194 người</div>
          </div>
        </label>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-normal">
          Cho phép bình luận bằng file GIF của
        </div>
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
      <div className="text-xs text-[#a0a8b9]">
        Mọi người sẽ có thể bình luận bằng file GIF về bài viết và thước phim
        của bạn.
      </div>
    </div>
  );
};
export default SettingComment;
