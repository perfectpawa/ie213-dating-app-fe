import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
import UserProfileCard from "../components/Matching/UserProfileCard";
import EnhancedMatchList from "../components/Matching/EnhancedMatchList";
import MatchNotification from "../components/Matching/MatchNotification";
import SwipeAnimation from "../components/Matching/SwipeAnimation";
import { useSwipe } from "../hooks/useSwipe";
import { Match } from "../types/swipe";
import { Loader2, Heart, Users, Sparkles, RefreshCw } from "lucide-react";

const Matching: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    // Enhanced match data
    outgoingLikes,
    incomingLikes,
    mutualMatches,
    loading,
    refreshing,
    handleSwipe,
    refreshPotentialMatches,
    refreshEnhancedMatchInfo,
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
      // Refresh enhanced match info when there's a new match
      refreshEnhancedMatchInfo();
    }
  }, [swipeResults, refreshEnhancedMatchInfo]);

  // Handle swipe action
  const onSwipe = (status: "like" | "dislike" | "superlike") => {
    if (currentProfile) {
      setSwipeAction(status);
      handleSwipe(currentProfile._id, status);
      // Refresh enhanced match info after any swipe
      setTimeout(() => {
        refreshEnhancedMatchInfo();
      }, 500);
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
      {/* Gradient Background */}
      <div className="min-h-screen rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8 rounded-4xl">



          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main swiping section */}
            <div className="xl:col-span-2">
              <div className="relative">
                {" "}
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#4edcd8]/20 to-teal-400/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-[#4edcd8]/20 rounded-full blur-2xl"></div>
                {refreshing ? (
                  <div className="relative flex justify-center items-center h-[600px] rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 text-white shadow-2xl">
                    {" "}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Loader2
                          size={48}
                          className="animate-spin text-[#4edcd8]"
                        />
                        <div className="absolute inset-0 bg-[#4edcd8]/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                      <span className="text-2xl font-semibold bg-gradient-to-r from-[#4edcd8] to-teal-400 bg-clip-text text-transparent">
                        Đang tải hồ sơ mới...
                      </span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#4edcd8] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <UserProfileCard
                      profile={currentProfile}
                      onSwipe={onSwipe}
                      loading={loading}
                      onViewFullProfile={handleViewFullProfile}
                    />
                  </div>
                )}
              </div>
            </div>






            {/* Enhanced Matches sidebar */}
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-3xl blur-3xl"></div>
              <div className="relative">
                <EnhancedMatchList
                  outgoingLikes={outgoingLikes}
                  incomingLikes={incomingLikes}
                  mutualMatches={mutualMatches}
                  loading={loading}
                />
              </div>
            </div>
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
        />{" "}
        {/* Floating Hearts Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-[#4edcd8]/10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Matching;
