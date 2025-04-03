import React from "react";
import MatchingSwiperContact from "./MatchingSwiperContact";

const MatchingSwiperList = () => {
  return (
    <div className="container mx-auto w-72 border rounded-md bg-white">
      <div className="mx-auto px-3 py-1 pb-1 rounded-md shadow-dashboard">
        <div className="flex flex-wrap items-center justify-between -m-2">
          <div className="w-auto py-1 px-2">
            <h2 className="text-lg font-semibold text-coolGray-900">
              Matching requests
            </h2>
          </div>
          <div className="w-auto p-2">
            <a
              href="#"
              className="text-sm text-green-500 hover:text-green-600 font-semibold"
            >
              See all
            </a>
          </div>
        </div>
      </div>
      <MatchingSwiperContact />
      <MatchingSwiperContact />
      <MatchingSwiperContact />
      <MatchingSwiperContact />
    </div>
  );
};

export default MatchingSwiperList;
