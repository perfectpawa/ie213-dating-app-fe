import React from "react";
import phuc from "../assets/phuc.jpg";

const MatchingCard = () => {
  return (
    <div
      style={{ backgroundImage: `url(${phuc})` }}
      className="bg-cover bg-center relative group duration-500 cursor-pointer group overflow-hidden relative text-gray-50 h-72 w-56 rounded-2xl hover:duration-700 duration-700"
    >
      <div className="w-56 h-72 text-gray-800">
        <div className="flex flex-row justify-between"></div>
      </div>
      <div className="absolute bg-gray-50 bottom-0 translate-y-[calc(100%-45px)] w-56 p-3 flex flex-col gap-1 group-hover:translate-y-0 group-hover:duration-600 duration-500">
        <span className="text-gray-900 font-bold text-xm">
          Đỗ Nguyễn Thiên Phúc
        </span>
        <span className="text-gray-800 font-bold text-xm">Sinh viên</span>
        <p className="text-neutral-800">
          Khi bạn thực sự mong muốn điều gì thì cả vũ trụ sẽ chung sức giúp bạn.
        </p>
      </div>
    </div>
  );
};

export default MatchingCard;
