import React, { useState } from "react";
import { Heart, MessageSquare, Search, ThumbsUp, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { InteractedUser } from "../../types/user";

interface EnhancedMatchListProps {
  outgoingLikes: InteractedUser[];  // Người mà bạn đã like
  incomingLikes: InteractedUser[];  // Người đã like bạn
  mutualMatches: InteractedUser[];  // Người đã match mutual
  loading: boolean;
}

interface UserCardProps {
  id: string;
  name: string;
  profilePicture?: string;
  status: 'matched' | 'swiped' | 'liked_you';
  swipeType?: 'like' | 'superlike';
  showUnreadCount?: number;
  showMessageIcon?: boolean;
}

const LoadingState: React.FC = () => (
  <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50">
    <h3 className="text-lg font-bold bg-gradient-to-r from-[#4edcd8] to-teal-400 bg-clip-text text-transparent mb-4 text-center">
      Thông Tin Ghép Đôi
    </h3>
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4edcd8] mb-4"></div>
        <div className="absolute inset-0 bg-[#4edcd8]/20 rounded-full blur-lg animate-pulse"></div>
      </div>
      <p className="text-gray-300 text-sm font-medium">
        Đang tải thông tin ghép đôi...
      </p>
    </div>
  </div>
);

const EmptySection: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="text-center py-8">
    <div className="mb-4 mx-auto w-12 h-12 bg-gradient-to-br from-[#4edcd8]/20 to-teal-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
      <Search size={24} className="text-[#4edcd8]" />
    </div>
    <p className="text-gray-300 text-base font-semibold mb-2">{title}</p>
    <p className="text-gray-500 text-xs max-w-xs mx-auto">{description}</p>
  </div>
);

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  profilePicture,
  status,
  swipeType,
  showUnreadCount,
  showMessageIcon,
}) => (
  <Link
    to={status === 'matched' ? `/messages/${id}` : `/profile/${id}`}
    onClick={() => {
      if (status === 'matched') {
        sessionStorage.setItem('activeMatchId', id);
        sessionStorage.setItem('matchedUserId', id);
      }
    }}
  >
    <div className="group relative bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-2 transition-all duration-300 hover:from-gray-600/80 hover:to-gray-700/80 hover:scale-105 hover:shadow-lg border border-gray-600/30">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <span className="text-white text-xs font-medium">No Image</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status indicator với enhanced styling */}
        <div 
          className="absolute bottom-1 right-1 p-1.5 rounded-full shadow-md backdrop-blur-sm border border-white/20"
          style={{ 
            background: `linear-gradient(135deg, ${
              status === 'matched' ? '#4edcd8, #38b2ac' : 
              status === 'liked_you' ? (swipeType === 'superlike' ? '#4edcd8, #06b6d4' : '#10b981, #059669') :
              swipeType === 'superlike' ? '#4edcd8, #06b6d4' : '#22d3ee, #0891b2'
            })`
          }}
        >
          {status === 'matched' ? (
            <Heart size={10} className="text-white drop-shadow-sm" />
          ) : status === 'liked_you' ? (
            swipeType === 'superlike' ? (
              <Sparkles size={10} className="text-white drop-shadow-sm" />
            ) : (
              <ThumbsUp size={10} className="text-white drop-shadow-sm" />
            )
          ) : swipeType === 'superlike' ? (
            <Sparkles size={10} className="text-white drop-shadow-sm" />
          ) : (
            <ThumbsUp size={10} className="text-white drop-shadow-sm" />
          )}
        </div>
        
        {showUnreadCount && showUnreadCount > 0 && (
          <div className="absolute top-1 left-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-1.5 py-0.5 text-xs text-white font-bold shadow-md">
            {showUnreadCount}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="truncate text-white text-xs font-semibold">
          {name}
        </div>
        {showMessageIcon && (
          <MessageSquare
            size={10}
            className="text-gray-300 flex-shrink-0 group-hover:text-white transition-colors duration-300"
          />
        )}
      </div>
    </div>
  </Link>
);

const SectionHeader: React.FC<{ title: string; count: number; emoji?: string }> = ({ 
  title, 
  count, 
  emoji = "" 
}) => (
  <div className="relative mb-4">
    <div className="absolute inset-0 bg-gradient-to-r from-[#4edcd8]/10 via-teal-400/10 to-cyan-400/10 rounded-xl blur-lg"></div>
    <h4 className="relative text-sm font-bold text-center text-white px-4 py-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 flex items-center justify-center space-x-2">
      {emoji && <span className="text-lg">{emoji}</span>}
      <span className="bg-gradient-to-r from-[#4edcd8] to-teal-400 bg-clip-text text-transparent">
        {title}
      </span>
      <span className="bg-gradient-to-r from-[#4edcd8] to-teal-400 text-white text-xs rounded-full py-1 px-2 font-bold shadow-md">
        {count}
      </span>
    </h4>
  </div>
);

// Component for pagination controls
const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-3 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`group relative p-2 rounded-full transition-all duration-300 ${
          currentPage === 0 
            ? 'text-gray-500 cursor-not-allowed opacity-50' 
            : 'text-white bg-gradient-to-r from-[#4edcd8] to-teal-400 hover:from-teal-400 hover:to-cyan-400 shadow-md hover:shadow-lg transform hover:scale-105'
        }`}
      >
        {currentPage > 0 && (
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
        )}
        <ChevronLeft size={14} className="relative z-10" />
      </button>
      
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50">
        <span className="text-xs font-semibold bg-gradient-to-r from-[#4edcd8] to-teal-400 bg-clip-text text-transparent">
          {currentPage + 1} / {totalPages}
        </span>
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`group relative p-2 rounded-full transition-all duration-300 ${
          currentPage === totalPages - 1 
            ? 'text-gray-500 cursor-not-allowed opacity-50' 
            : 'text-white bg-gradient-to-r from-[#4edcd8] to-teal-400 hover:from-teal-400 hover:to-cyan-400 shadow-md hover:shadow-lg transform hover:scale-105'
        }`}
      >
        {currentPage < totalPages - 1 && (
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
        )}
        <ChevronRight size={14} className="relative z-10" />
      </button>
    </div>
  );
};

const EnhancedMatchList: React.FC<EnhancedMatchListProps> = ({ 
  outgoingLikes, 
  incomingLikes, 
  mutualMatches, 
  loading 
}) => {
  // State for pagination
  const [mutualMatchesPage, setMutualMatchesPage] = useState(0);
  const [incomingLikesPage, setIncomingLikesPage] = useState(0);
  const [outgoingLikesPage, setOutgoingLikesPage] = useState(0);
  
  const ITEMS_PER_PAGE = 2;

  // Helper function to get paginated items
  const getPaginatedItems = (items: InteractedUser[], page: number) => {
    const startIndex = page * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Helper function to get total pages
  const getTotalPages = (itemsLength: number) => Math.ceil(itemsLength / ITEMS_PER_PAGE);

  // Debug logging để kiểm tra dữ liệu
  React.useEffect(() => {
    console.log('Enhanced Match Data:', {
      outgoingLikes: outgoingLikes.map(like => ({
        name: like.user.user_name,
        swipeType: like.swipeType,
        status: like.status
      })),
      incomingLikes: incomingLikes.map(like => ({
        name: like.user.user_name,
        swipeType: like.swipeType,
        status: like.status
      })),
      mutualMatches: mutualMatches.length
    });
  }, [outgoingLikes, incomingLikes, mutualMatches]);

  if (loading) {
    return <LoadingState />;
  }

  const totalInteractions = outgoingLikes.length + incomingLikes.length + mutualMatches.length;
  if (totalInteractions === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-4">
        <EmptySection 
          title="Chưa có hoạt động ghép đôi nào"
          description="Bắt đầu vuốt để tìm người phù hợp!"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-4 space-y-6">
      {/* Decorative Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#4edcd8]/20 to-teal-400/20 rounded-full mb-3">
          <Heart className="w-6 h-6 text-[#4edcd8]" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-[#4edcd8] to-teal-400 bg-clip-text text-transparent">
          Kết Nối Của Bạn
        </h3>
      </div>

      {/* Mutual Matches Section */}
      {mutualMatches.length > 0 && (
        <div>
          <SectionHeader 
            title="💖 ĐÃ GHÉP ĐÔI" 
            count={mutualMatches.length}
          />
          <div className="grid grid-cols-2 gap-2">
            {getPaginatedItems(mutualMatches, mutualMatchesPage).map((match) => (
              <UserCard
                key={match.user._id}
                id={match.matchId || match.user._id}
                name={match.user.user_name || "User"}
                profilePicture={match.user.profile_picture}
                status="matched"
                showUnreadCount={0}
                showMessageIcon={true}
              />
            ))}
          </div>
          <PaginationControls
            currentPage={mutualMatchesPage}
            totalPages={getTotalPages(mutualMatches.length)}
            onPageChange={setMutualMatchesPage}
          />
        </div>
      )}

      {/* Incoming Likes Section */}
      {incomingLikes.length > 0 && (
        <div>
          <SectionHeader 
            title="👍 ĐÃ THÍCH BẠN" 
            count={incomingLikes.length}
          />
          <div className="grid grid-cols-2 gap-2">
            {getPaginatedItems(incomingLikes, incomingLikesPage).map((like) => (
              <UserCard
                key={like.user._id}
                id={like.user._id}
                name={like.user.user_name || "User"}
                profilePicture={like.user.profile_picture}
                status="liked_you"
                swipeType={like.swipeType}
                showUnreadCount={0}
                showMessageIcon={false}
              />
            ))}
          </div>
          <PaginationControls
            currentPage={incomingLikesPage}
            totalPages={getTotalPages(incomingLikes.length)}
            onPageChange={setIncomingLikesPage}
          />
        </div>
      )}

      {/* Outgoing Likes Section */}
      {outgoingLikes.length > 0 && (
        <div>
          <SectionHeader 
            title="⭐ BẠN ĐÃ THÍCH" 
            count={outgoingLikes.length}
          />
          <div className="grid grid-cols-2 gap-2">
            {getPaginatedItems(outgoingLikes, outgoingLikesPage).map((like) => (
              <UserCard
                key={like.user._id}
                id={like.user._id}
                name={like.user.user_name || "User"}
                profilePicture={like.user.profile_picture}
                status="swiped"
                swipeType={like.swipeType}
                showUnreadCount={0}
                showMessageIcon={false}
              />
            ))}
          </div>
          <PaginationControls
            currentPage={outgoingLikesPage}
            totalPages={getTotalPages(outgoingLikes.length)}
            onPageChange={setOutgoingLikesPage}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedMatchList;
