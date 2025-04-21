import React from "react";
import MatchingOpponent from "./MatchingOpponent";

const MatchingOpponentsList = () => {
  return (
    <div className="container mx-auto w-72 border rounded-md bg-white">
      <div className="px-3 py-1 pb-1 rounded-md shadow-dashboard">
        <div className="flex flex-wrap items-center justify-between -m-2">
          <div className="w-auto py-1 px-2">
            <h2 className="text-lg font-semibold text-coolGray-900">
              My matching opponents
            </h2>
          </div>
          <div className="w-auto py-1 px-2">
            <a
              href="#"
              className="text-sm text-green-500 hover:text-green-600 font-semibold"
            >
              See all
            </a>
          </div>
        </div>
      </div>
      <MatchingOpponent />
      <MatchingOpponent />
      <MatchingOpponent />
    </div>
  );
};

export default MatchingOpponentsList;
