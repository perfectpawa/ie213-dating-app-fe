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

  // Show confetti effect on mount
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Generate multiple hearts for animation
  const generateHearts = (count: number) => {
    return Array.from({ length: count }).map((_, index) => {
      const size = Math.floor(Math.random() * 20) + 16; // Random size between 16-36
      const left = Math.floor(Math.random() * 80) + 10; // Random position 10-90%
      const delay = Math.random() * 2; // Random delay 0-2s
      const duration = Math.random() * 3 + 2; // Random duration 2-5s

      return (
        <Heart
          key={index}
          className={`text-pink-${
            Math.random() > 0.5 ? "500" : "400"
          } absolute animate-float`}
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

      return (
        <div
          key={index}
          className="absolute top-0 rounded-full animate-confetti"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
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

      <div className="bg-gradient-to-b from-pink-500 to-purple-600 rounded-xl p-1 max-w-md w-full relative">
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
            {/* Animated hearts */}
            <div className="relative h-24 w-full mb-2 overflow-hidden">
              {generateHearts(12)}

              <Heart
                className="text-pink-500 animate-pulse absolute top-0 left-1/4 transform -translate-x-1/2"
                size={32}
              />
              <Heart
                className="text-pink-500 animate-ping absolute top-6 left-1/3"
                size={24}
              />
              <Heart
                className="text-pink-500 animate-bounce absolute top-8 right-1/4"
                size={28}
              />
              <Heart
                className="text-pink-500 animate-pulse absolute top-4 right-1/3"
                size={20}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Heart className="text-pink-500 animate-pulse" size={64} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-400 animate-pulse" size={24} />{" "}
              <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-pink-400 to-purple-400 inline-block">
                Đã Ghép Đôi!
              </h2>
              <Sparkles className="text-yellow-400 animate-pulse" size={24} />
            </div>

            {/* Profile pictures */}
            <div className="flex justify-center items-center space-x-8 my-8">
              {/* Current user */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-glow-blue transform -rotate-6 animate-bounce-slow">
                <img
                  src={user?.profile_picture || avatarPlaceholder}
                  alt="Hồ sơ của bạn"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Matched user */}
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500 shadow-glow-pink transform rotate-6 animate-bounce-slow"
                style={{ animationDelay: "0.5s" }}
              >
                <img
                  src={match.otherUser?.profile_picture || avatarPlaceholder}
                  alt={match.otherUser?.user_name || "Ghép đôi"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-lg text-gray-300 mb-8">
              Bạn và{" "}
              <span className="text-gradient bg-gradient-to-r from-pink-400 to-purple-400 font-semibold">
                {match.otherUser?.user_name || "người ghép đôi của bạn"}
              </span>{" "}
              đã thích nhau!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Tiếp Tục Vuốt
              </button>

              <Link
                to={`/chat/${match.matchId}`}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-105"
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
