import React from "react";

const RequestModalItem = ({}) => {
  return (
    <div className="flex items-center justify-between mt-2 first:mt-0 h-[54px]">
      <div className="flex items-center gap-2">
        <img
          src="https://storage.googleapis.com/a1aa/image/3464ce73-f5b6-408e-542b-12656b73b0aa.jpg"
          alt=""
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-center gap-1 font-semibold text-sm text-black leading-4">
            <span>ntp_hien</span>
          </div>
          <div className="text-gray-600 text-sm font-normal leading-4">
            Hiền Nguyễn
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          type="button"
          className="bg-red-500 rounded-sm px-3 py-1.5 font-semibold text-sm leading-4 text-white cursor-pointer select-none mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          Xóa
        </button>
        <button
          type="button"
          className="bg-gray-200 rounded-sm px-3 py-1.5 font-semibold text-sm leading-4 text-black cursor-pointer select-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          Chấp nhận
        </button>
      </div>
    </div>
  );
};
export default RequestModalItem;
