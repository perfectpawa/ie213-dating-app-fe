import React from "react";
import RequestModalItem from "./RequestModalItem";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

const RequestModal = () => {
  return (
    <div className="w-[400px] max-w-full bg-white rounded-xl border border-black py-2 px-4 flex flex-col h-[400px] relative">
      <div
        id="dialogTitle"
        className="flex justify-between font-semibold text-base leading-5 relative pb-2"
      >
        <IoCloseSharp className="text-left text-white" />
        <p className="">Yêu cầu kết nối</p>
        <IoCloseSharp className="text-left text-2xl" />
      </div>
      <hr className="pb-2 -mx-4 border-gray-300" />
      <div className="relative">
        <IoIosSearch className="absolute top-2 left-3 text-gray-400" />
        <input
          type="search"
          aria-label="Tìm kiếm người theo dõi"
          placeholder="Tìm kiếm"
          className="w-full h-[32px] rounded-lg bg-gray-200 pl-9 pr-3 text-sm text-black placeholder-gray-400 outline-none focus:outline-offset-[-2px]"
        />
      </div>
      <div
        aria-label="Danh sách người theo dõi"
        className="overflow-y-auto flex-grow pr-1 mt-2"
      >
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
        <RequestModalItem />
      </div>
    </div>
  );
};
export default RequestModal;
