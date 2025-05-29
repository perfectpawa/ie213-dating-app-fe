import React from "react";
import { Match } from "../../types/swipe";
import { Heart, MessageSquare, User, Search } from "lucide-react";
import avatarPlaceholder from "../../assets/avatar_holder.png";
import { Link } from "react-router-dom";

interface MatchListProps {
  matches: Match[];
  loading: boolean;
}

const MatchList: React.FC<MatchListProps> = ({ matches, loading }) => {
  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-white mb-4">
          Những lượt ghép đôi của bạn
        </h3>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#49cdca] mb-4"></div>
          <p className="text-gray-400 text-sm">
            Đang tải các lượt ghép đôi của bạn...
          </p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md text-center">
        {" "}
        <h3 className="text-xl font-semibold text-white mb-4">
          Những lượt ghép đôi của bạn
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <div className="mb-4 bg-gray-700 rounded-full p-4">
            <Search size={32} className="text-[#49cdca]" />
          </div>
          <p className="mb-2">Chưa có lượt ghép đôi nào</p>
          <p className="text-sm px-4">
            Khi bạn và một người khác thích nhau, bạn sẽ thấy các lượt ghép đôi
            ở đây!
          </p>
          <div className="flex items-center gap-1 mt-4 text-xs bg-gray-700 rounded-full px-3 py-1">
            <Heart size={12} className="text-[#49cdca]" />
            <span>Tiếp tục vuốt để tìm người phù hợp</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4">
      {" "}
      <h3 className="text-xl font-semibold text-white mb-4 px-2 flex items-center">
        Những lượt ghép đôi của bạn
        <span className="ml-2 bg-[#49cdca] text-xs text-white rounded-full py-1 px-2 font-normal">
          {matches.length}
        </span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {matches.map((match) => (
          <Link
            to={`/chat/${match.matchId}`}
            key={match.matchId}
            className="block group"
          >
            <div className="bg-gray-700 rounded-lg p-2 transition-all hover:bg-gray-600">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                {match.otherUser?.profile_picture ? (
                  <img
                    src={match.otherUser.profile_picture}
                    alt={match.otherUser?.user_name || "Ghép đôi"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <User size={30} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-[#49cdca] p-1 rounded-full">
                  <Heart size={14} className="text-white" />
                </div>

                {/* If there are unread messages, show indicator */}
                {match.unreadCount && match.unreadCount > 0 ? (
                  <div className="absolute top-1 left-1 bg-green-500 rounded-full px-1.5 py-0.5 text-xs text-white font-bold">
                    {match.unreadCount}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <div className="truncate text-white text-sm font-medium">
                  {match.otherUser?.user_name || "User"}
                </div>

                {match.latestMessage && (
                  <MessageSquare
                    size={14}
                    className="text-gray-400 flex-shrink-0"
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MatchList;
