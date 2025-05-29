import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
import UserProfileCard from "../components/Matching/UserProfileCard";
import MatchList from "../components/Matching/MatchList";
import MatchNotification from "../components/Matching/MatchNotification";
import SwipeAnimation from "../components/Matching/SwipeAnimation";
import { useSwipe } from "../hooks/useSwipe";
import { Match } from "../types/swipe";
import { Loader2 } from "lucide-react";

const Matching: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    matches,
    swipedUsers,
    interactedUsers,
    loading,
    refreshing,
    handleSwipe,
    refreshPotentialMatches,
    hasMoreProfiles,
    swipeResults,
  } = useSwipe();

  const [showMatchNotification, setShowMatchNotification] =
    useState<boolean>(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [swipeAction, setSwipeAction] = useState<
    "like" | "dislike" | "superlike" | null
  >(null);

  // Show match notification when a new match is created
  useEffect(() => {
    if (swipeResults?.match) {
      setCurrentMatch(swipeResults.match);
      setShowMatchNotification(true);
    }
  }, [swipeResults]); // Handle swipe action
  const onSwipe = (status: "like" | "dislike" | "superlike") => {
    if (currentProfile) {
      setSwipeAction(status);
      handleSwipe(currentProfile._id, status);
    }
  };

  // Clear animation state
  const handleAnimationComplete = () => {
    setSwipeAction(null);
  };

  // Navigate to user profile
  const handleViewFullProfile = () => {
    if (currentProfile?._id) {
      navigate(`/profile/${currentProfile._id}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Tìm Kiếm Người Phù Hợp
          </h1>
          <button
            onClick={refreshPotentialMatches}
            className="px-4 py-2 bg-[#48cbca] text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
            disabled={loading || refreshing}
          >
            {" "}
            {refreshing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang Làm Mới...</span>
              </>
            ) : (
              <span>Làm Mới Hồ Sơ</span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main swiping section */}
          <div className="lg:col-span-2">
            {refreshing ? (
              <div className="flex justify-center items-center h-[36rem] rounded-2xl bg-gray-800 text-white">
                <div className="flex flex-col items-center">
                  <Loader2 size={32} className="animate-spin mb-4" />
                  <span className="text-xl">Đang tải hồ sơ mới...</span>
                </div>
              </div>
            ) : (
              <UserProfileCard
                profile={currentProfile}
                onSwipe={onSwipe}
                loading={loading}
                onViewFullProfile={handleViewFullProfile}
              />
            )}
            {/*             
            {!refreshing && !loading && !currentProfile && !hasMoreProfiles && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-gray-300 mb-2">
                  Bạn đã xem qua tất cả hồ sơ có sẵn.
                </p>
                <button
                  onClick={() => refreshPotentialMatches()}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  Làm mới hồ sơ
                </button>
              </div>
            )} */}
          </div>

          {/* Matches sidebar */}
          <div>
            <MatchList interactedUsers={interactedUsers} loading={loading} />
          </div>
        </div>

        {/* Match notification modal */}
        {showMatchNotification && currentMatch && (
          <MatchNotification
            match={currentMatch}
            onClose={() => setShowMatchNotification(false)}
          />
        )}

        {/* Swipe animation overlay */}
        <SwipeAnimation
          action={swipeAction}
          onComplete={handleAnimationComplete}
        />
      </div>
    </Layout>
  );
};

export default Matching;
