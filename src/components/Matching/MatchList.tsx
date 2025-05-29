import React from "react";
import { Heart, MessageSquare, Search, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { InteractedUser, User } from "../../types/user";

interface MatchListProps {
  interactedUsers: InteractedUser[];
  loading: boolean;
}

const LoadingState: React.FC = () => (
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

const EmptyState: React.FC = () => (
  <div className="p-6 bg-gray-800 rounded-lg shadow-md text-center">
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

interface UserCardProps {
  id: string;
  name: string;
  profilePicture?: string;
  status: 'matched' | 'swiped';
  showUnreadCount?: number;
  showMessageIcon?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  profilePicture,
  status,
  showUnreadCount,
  showMessageIcon,
}) => (
  <Link  
    key={id} 
    className="block group"
    to={status === 'matched' ? `/chat/${id}` : `/profile/${id}`}
  >
    <div className="bg-gray-700 rounded-lg p-2 transition-all hover:bg-gray-600">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="text-white">No Image</span>
          </div>
        )}
        {/* background is yellow when swipe */}
        <div className="absolute bottom-1 right-1 bg-[#49cdca] p-1 rounded-full"
          style={{ backgroundColor: status === 'matched' ? '#49cdca' : '#f59e0b' }}
        >
          {status === 'matched' ? (
            <Heart size={14} className="text-white" />
          ) : (
            <ThumbsUp size={14} className="text-white" />
          )}
        </div>
        {showUnreadCount && showUnreadCount > 0 && (
          <div className="absolute top-1 left-1 bg-green-500 rounded-full px-1.5 py-0.5 text-xs text-white font-bold">
            {showUnreadCount}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="truncate text-white text-sm font-medium">
          {name}
        </div>
        {showMessageIcon && (
          <MessageSquare
            size={14}
            className="text-gray-400 flex-shrink-0"
          />
        )}
      </div>
    </div>
  </Link>
);

const SectionHeader: React.FC<{ title: string; count: number }> = ({ title, count }) => (
  <h3 className="text-xl font-semibold text-white mb-4 px-2 flex items-center">
    {title}
    <span className="ml-2 bg-[#49cdca] text-xs text-white rounded-full py-1 px-2 font-normal">
      {count}
    </span>
  </h3>
);

const MatchList: React.FC<MatchListProps> = ({ interactedUsers, loading }) => {
  if (loading) {
    return <LoadingState />;
  }

  if (interactedUsers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4">
      <SectionHeader title="Những lượt ghép đôi của bạn" count={interactedUsers.length} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {interactedUsers.map((interaction) => (
          <UserCard
            key={interaction.user._id}
            id={interaction.user._id}
            name={interaction.user.user_name || "User"}
            profilePicture={interaction.user.profile_picture}
            status={interaction.status}
            showUnreadCount={0}
            showMessageIcon={true}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchList;
