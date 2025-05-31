import React, { useRef, useState } from 'react';
import { Camera, Pencil, Mars, Venus, User as UserIcon, Clock, AlertCircle, ThumbsUp, MessageCircle } from 'lucide-react';
import { User } from '../../types/user';
import avatarPlaceholder from '../../assets/avatar_holder.png';
import { swipeApi } from '../../api/swipeApi';
import MatchNotification from '../Matching/MatchNotification';
import { Match } from '../../types/swipe';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onProfilePictureChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCoverPictureChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onEditClick?: () => void;
  loading?: boolean;
  relationshipStatus?: string | null;
  onSwipeComplete?: () => void;
}

interface StatusConfig {
  icon: React.ReactNode;
  text: string;
  className: string;
  onClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = false,
  onProfilePictureChange,
  onCoverPictureChange,
  onEditClick,
  loading = false,
  relationshipStatus,
  onSwipeComplete,
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [swipeLoading, setSwipeLoading] = useState(false);

  const handleSwipe = async (status: 'like' | 'dislike') => {
    if (!user._id || !currentUser?._id || swipeLoading) return;

    try {
      setSwipeLoading(true);
      const response = await swipeApi.createSwipe(currentUser._id, user._id, status);
      
      if (response.data?.data?.match) {
        setMatchData(response.data.data.match);
        setShowMatchNotification(true);
      }
      
      // Call onSwipeComplete after successful swipe
      onSwipeComplete?.();
    } catch (err) {
      console.error('Error processing swipe:', err);
    } finally {
      setSwipeLoading(false);
    }
  };

  const getRelationshipStatusDisplay = () => {
    if (!relationshipStatus) return null;

    const statusConfig: Record<string, StatusConfig> = {
      'match': {
        icon: <MessageCircle size={16} className="text-pink-500" />,
        text: 'Nhắn tin',
        className: 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 cursor-pointer',
        onClick: () => navigate(`/messages/${user._id}`)
      },
      'wait_for_their_swipe': {
        icon: <Clock size={16} className="text-yellow-500" />,
        text: 'Đang chờ họ swipe',
        className: 'bg-yellow-500/20 text-yellow-400'
      },
      'wait_for_your_swipe': {
        icon: <AlertCircle size={16} className="text-blue-500" />,
        text: 'Đang chờ bạn swipe',
        className: 'bg-blue-500/20 text-blue-400'
      },
      'no_relevant': {
        icon: null,
        text: 'Chưa tương tác',
        className: 'bg-gray-500/20 text-gray-400'
      }
    };

    const config = statusConfig[relationshipStatus];
    if (!config) return null;

    return (
      <span 
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.className}`}
        onClick={config.onClick}
      >
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-pink-500 to-purple-500 relative">
        <img
          src={user.cover_picture || "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/04/ada-wong-resident-evil-4-helicopter.jpg"}
          alt="Cover Photo"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && onCoverPictureChange && (
          <button
            className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-1.25 flex items-center justify-center shadow-md opacity-60 cursor-pointer hover:bg-gray-300"
            onClick={() => coverInputRef.current?.click()}
            disabled={loading}
          >
            <Camera size={20} />
            <input
              type="file"
              ref={coverInputRef}
              onChange={onCoverPictureChange}
              accept="image/*"
              className="hidden"
            />
          </button>
        )}
      </div>

      <div className="px-6 py-8 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <img
            src={user.profile_picture || avatarPlaceholder}
            alt={`${user.user_name}'s avatar`}
            className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
          />
          {isOwnProfile && onProfilePictureChange && (
            <span 
              className="absolute bottom-0 right-0 p-1.5 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700" 
              onClick={() => avatarInputRef.current?.click()}
            >
              <Camera size={18} className="text-white" />
              <input
                type="file"
                ref={avatarInputRef}
                onChange={onProfilePictureChange}
                accept="image/*"
                className="hidden"
              />
            </span>
          )}
        </div>

        {/* Profile Details */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-bold text-white">{user.user_name}</h1>
              <span className="text-gray-400">
                {user.full_name}
              </span>
            </div>
            {!isOwnProfile && (
              relationshipStatus === 'no_relevant' ? (
                <button
                  onClick={() => handleSwipe('like')}
                  disabled={swipeLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm font-medium">Thích</span>
                </button>
              ) : relationshipStatus === 'wait_for_your_swipe' ? (
                <button
                  onClick={() => handleSwipe('like')}
                  disabled={swipeLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                >
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Swipe ngay</span>
                </button>
              ) : (
                getRelationshipStatusDisplay()
              )
            )}
          </div>

          {isOwnProfile && onEditClick && (
            <button
              onClick={onEditClick}
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
            >
              <Pencil size={16} />
              <span>Chỉnh sửa</span>
            </button>
          )}

          {/* Gender and Age */}
          <div className="flex items-center gap-2 text-gray-300 mt-2">
            {user.gender && (
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                user.gender === 'male' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : user.gender === 'female' 
                  ? 'bg-pink-500/20 text-pink-400' 
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {user.gender === 'male' ? (
                  <Mars size={16} />
                ) : user.gender === 'female' ? (
                  <Venus size={16} />
                ) : (
                  <UserIcon size={16} />
                )}
                {user.birthday && (
                  <span className="text-sm font-medium">
                    {Math.floor((new Date().getTime() - new Date(user.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25))}
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Bio */}
          <div className="mt-3.5">
            <p className="flex flex-row mt-8 text-white">{user.bio}</p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 flex flex-col gap-4">
          </div>
        </div>
      </div>

      {/* Match Notification */}
      {showMatchNotification && matchData && (
        <MatchNotification
          match={matchData}
          onClose={() => setShowMatchNotification(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeader; 