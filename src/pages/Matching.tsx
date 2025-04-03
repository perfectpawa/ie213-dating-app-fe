import React from "react";
import MatchingOpponentsList from "../components/MatchingOpponentsList";
import MatchingSwiperList from "@/components/MatchingSwiperList";
import MatchingCard from "@/components/MatchingCard";

const Matching = () => {
  return (
    <div className="h-150 w-full flex justify-center">
      <div className="h-full w-308 grid grid-cols-5">
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
        <MatchingCard />
      </div>
      <div className="h-full w-72">
        <MatchingOpponentsList />
        <MatchingSwiperList />
      </div>
    </div>
  );
};

export default Matching;
