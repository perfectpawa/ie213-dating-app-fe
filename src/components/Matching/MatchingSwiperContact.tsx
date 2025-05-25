import React from "react";

const MatchingSwiperContact = () => {
  return (
    <div className="flex items-center py-1 px-3 w-72 h-20 rounded-md">
      <section className="flex justify-center items-center w-14 h-14 rounded-full shadow-md bg-gradient-to-r from-[#F9C97C] to-[#A2E9C1] hover:from-[#C9A9E9] hover:to-[#7EE7FC] hover:cursor-pointer hover:scale-110 duration-300"></section>

      <section className="block border-l border-gray-300 m-3">
        <div className="pl-3">
          <h3 className="text-gray-900 font-semibold text-sm">
            Nguyễn Công Nam Triều
          </h3>
          <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-lg font-bold">
            Web Developer
          </h3>
        </div>
      </section>
    </div>
  );
};

export default MatchingSwiperContact;
