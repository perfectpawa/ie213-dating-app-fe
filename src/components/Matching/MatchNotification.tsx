import React, { useEffect, useState } from "react";
import { Match } from "../../types/swipe";
import { Heart, MessageCircle, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import avatarPlaceholder from "../../assets/avatar_holder.png";
import { useAuth } from "../../hooks/useAuth";
import "./matchingAnimations.css";

interface MatchNotificationProps {
  match: Match;
  onClose: () => void;
}

const MatchNotification: React.FC<MatchNotificationProps> = ({
  match,
  onClose,
}) => {
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  // Show confetti effect on mount and log match data for debugging
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Log match data for debugging
    console.log("Match notification data:", match);
    console.log("Other user data:", match.otherUser);

    return () => clearTimeout(timer);
  }, [match]);
  // Generate multiple hearts for animation
  const generateHearts = (count: number) => {
    return Array.from({ length: count }).map((_, index) => {
      const size = Math.floor(Math.random() * 20) + 16; // Random size between 16-36
      const left = Math.floor(Math.random() * 80) + 10; // Random position 10-90%
      const delay = Math.random() * 2; // Random delay 0-2s
      const duration = Math.random() * 3 + 2; // Random duration 2-5s
      const tealColors = ["text-[#4edcd8]", "text-teal-400", "text-cyan-400"];
      const randomColor =
        tealColors[Math.floor(Math.random() * tealColors.length)];

      return (
        <Heart
          key={index}
          className={`${randomColor} absolute animate-float`}
          style={{
            left: `${left}%`,
            top: `-${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
          size={size}
        />
      );
    });
  };
  // Create confetti elements
  const generateConfetti = () => {
    return Array.from({ length: 40 }).map((_, index) => {
      const left = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;

      // Teal-themed colors
      const colors = ["#4edcd8", "#2dd4bf", "#06b6d4", "#22d3ee"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return (
        <div
          key={index}
          className="absolute top-0 rounded-full animate-confetti"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 animate-fadeIn">
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateConfetti()}
        </div>
      )}

      <div className="bg-gradient-to-b from-[#4edcd8] to-teal-400 rounded-xl p-1 max-w-md w-full relative">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center relative">
            {/* Animated hearts */}{" "}
            <div className="relative h-24 w-full mb-2 overflow-hidden">
              {generateHearts(12)}

              <Heart
                className="text-[#4edcd8] animate-pulse absolute top-0 left-1/4 transform -translate-x-1/2"
                size={32}
              />
              <Heart
                className="text-[#4edcd8] animate-ping absolute top-6 left-1/3"
                size={24}
              />
              <Heart
                className="text-teal-400 animate-bounce absolute top-8 right-1/4"
                size={28}
              />
              <Heart
                className="text-cyan-400 animate-pulse absolute top-4 right-1/3"
                size={20}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Heart className="text-[#4edcd8] animate-pulse" size={64} />
              </div>
            </div>{" "}
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-300 animate-pulse" size={24} />{" "}
              <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-[#4edcd8] to-teal-400 inline-block">
                Đã Ghép Đôi!
              </h2>
              <Sparkles className="text-cyan-300 animate-pulse" size={24} />
            </div>{" "}
            {/* Profile pictures */}
            <div className="flex justify-center items-center space-x-8 my-8">
              {/* Current user */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4edcd8] shadow-lg shadow-[#4edcd8]/30 transform -rotate-6 animate-bounce-slow">
                <img
                  src={user?.profile_picture || avatarPlaceholder}
                  alt="Hồ sơ của bạn"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = avatarPlaceholder;
                  }}
                />
              </div>

              {/* Heart in the middle */}
              <div className="flex items-center justify-center">
                <Heart className="text-[#4edcd8] animate-pulse" size={32} />
              </div>

              {/* Matched user */}
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-400 shadow-lg shadow-teal-400/30 transform rotate-6 animate-bounce-slow"
                style={{ animationDelay: "0.5s" }}
              >
                <img
                  src={match.otherUser?.profile_picture || avatarPlaceholder}
                  alt={match.otherUser?.user_name || "Ghép đôi"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = avatarPlaceholder;
                  }}
                />
              </div>
            </div>{" "}
            <p className="text-lg text-gray-300 mb-8">
              Bạn và{" "}
              <span className="text-gradient bg-gradient-to-r from-[#4edcd8] to-teal-400 font-semibold">
                {match.otherUser?.user_name || "người ghép đôi của bạn"}
              </span>{" "}
              đã thích nhau!
            </p>{" "}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 hover:scale-105"
              >
                Tiếp Tục Vuốt
              </button>              <Link
                to={`/messages/${match.matchId}`}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#4edcd8] to-teal-400 text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4edcd8]/25"
                onClick={() => {
                  // Optional: Add analytics tracking for chat initiation
                  console.log("Match chat initiated:", match.matchId);
                }}
              >
                <MessageCircle size={18} />
                <span>Bắt Đầu Trò Chuyện</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchNotification;
