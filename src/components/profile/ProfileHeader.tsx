import React, { useRef, useState } from 'react';
import { Camera, Pencil, Mars, Venus, User as UserIcon, Clock, AlertCircle, ThumbsUp, MessageCircle, X } from 'lucide-react';
import { User } from '../../types/user';
import avatarPlaceholder from '../../assets/avatar_holder.png';
import { swipeApi } from '../../api/swipeApi';
import MatchNotification from '../Matching/MatchNotification';
import { Match } from '../../types/swipe';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import UnmatchModal from '../Modal/UnmatchModal';

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
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);
  const [unmatchLoading, setUnmatchLoading] = useState(false);

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

  const handleUnmatch = async () => {
    if (!user._id || !currentUser?._id || unmatchLoading) return;

    try {
      setUnmatchLoading(true);
      
      // First, get all matches to find the match ID
      const response = await swipeApi.getUserMatches(currentUser._id);
      const matches = response.data?.data?.matches || [];
      
      // Find the match with the current user
      const match = matches.find(m => 
        (m.user1Id === currentUser._id && m.user2Id === user._id) || 
        (m.user1Id === user._id && m.user2Id === currentUser._id)
      );

      if (!match) {
        throw new Error('Match not found');
      }

      // Now delete the match using the match ID
      await swipeApi.deleteMatch(match._id);
      onSwipeComplete?.();
      setShowUnmatchModal(false);
    } catch (err) {
      console.error('Error unmatching:', err);
    } finally {
      setUnmatchLoading(false);
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
        text: 'Hãy đợi họ đồng ý kết nối với bạn',
        className: 'bg-yellow-500/20 text-yellow-400'
      },
      'wait_for_your_swipe': {
        icon: <AlertCircle size={16} className="text-blue-500" />,
        text: 'Đang đợi lời đồny ý của bạn. Kết nối với họ ngay',
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
      <div className="flex items-center gap-2">
        {relationshipStatus === 'match' && (
          <>
            <button
              onClick={config.onClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-sm font-medium">Nhắn tin</span>
            </button>
            <button
              onClick={() => setShowUnmatchModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <X size={16} />
              <span className="text-sm font-medium">Mất kết nối</span>
            </button>
          </>
        )}
        {relationshipStatus !== 'match' && (
          <span 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.className}`}
            onClick={config.onClick}
          >
            {config.icon}
            <span className="text-sm font-medium">{config.text}</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Cover Photo with better gradient */}
        <div className="h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
          {!user.cover_picture ? (
            <div className="w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={user.cover_picture}
                alt="Cover Photo"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
            </div>
          )}
          {isOwnProfile && onCoverPictureChange && (
            <button
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 flex items-center justify-center shadow-md hover:bg-white/30 transition-all"
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
          {/* Avatar with improved styling */}
          <div className="absolute -top-20 left-6">
            <div className="w-36 h-36 rounded-full border-4 border-gray-800 overflow-hidden shadow-lg">
              <img
                src={user.profile_picture || avatarPlaceholder}
                alt={`${user.user_name}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            {isOwnProfile && onProfilePictureChange && (
              <span 
                className="absolute bottom-1 right-1 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-all shadow-md"
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

          {/* Profile Details with improved layout */}
          <div className="mt-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-baseline flex-wrap gap-3">
                  <h1 className="text-3xl font-bold text-white">{user.user_name}</h1>
                  {/* Better styled user full name */}
                  <span className="text-lg text-gray-400 font-light">
                    {user.full_name}
                  </span>
                </div>

                {/* Gender and Age with improved badges */}
                <div className="flex items-center gap-2 text-gray-300 mt-3">
                  {user.gender && (
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                      user.gender === 'male' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : user.gender === 'female' 
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
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
              </div>

              {/* Action buttons with better styling */}
              <div className="flex items-center gap-2">
                {isOwnProfile && onEditClick && (
                  <button
                    onClick={onEditClick}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                  >
                    <Pencil size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
                {!isOwnProfile && (
                  relationshipStatus === 'no_relevant' ? (
                    <button
                      onClick={() => handleSwipe('like')}
                      disabled={swipeLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                    >
                      <ThumbsUp size={16} />
                      <span className="text-sm font-medium">Kết nối ngay</span>
                    </button>
                  ) : relationshipStatus === 'wait_for_your_swipe' ? (
                    <button
                      onClick={() => handleSwipe('like')}
                      disabled={swipeLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-blue-500 text-blue-100 hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <AlertCircle size={16} />
                      <span className="text-sm font-medium">Đồng ý kết nối</span>
                    </button>
                  ) : (
                    getRelationshipStatusDisplay()
                  )
                )}
              </div>
            </div>

            {/* Bio with improved styling */}
            <div className="mt-6 bg-gray-700/30 p-4 rounded-lg">
              <p className="text-white leading-relaxed">{user.bio || "Chưa có thông tin giới thiệu."}</p>
            </div>

            {/* Additional Info section */}
            <div className="mt-4 flex flex-col gap-4">
              {/* Có thể thêm thông tin khác ở đây */}
            </div>
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

      {/* Unmatch Modal */}
      <UnmatchModal
        isOpen={showUnmatchModal}
        onClose={() => setShowUnmatchModal(false)}
        onConfirm={handleUnmatch}
        userName={user.user_name || user.full_name || 'this user'}
      />
    </>
  );
};

export default ProfileHeader;