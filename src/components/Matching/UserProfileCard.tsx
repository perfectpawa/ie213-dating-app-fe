import React, { useState, useEffect } from "react";
import { User } from "../../types/user";
import {
  Heart,
  X,
  Star,
  MapPin,
  Coffee,
  Music,
  Film,
  Book,
  Globe,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  RefreshCw,
  Settings,
  Mars,
  Venus,
  User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "../../assets/avatar_holder.png";
import { userApi } from "../../api/userApi";

interface UserProfileCardProps {
  profile: User | null;
  onSwipe: (status: "like" | "dislike" | "superlike") => void;
  loading?: boolean;
  onViewFullProfile?: () => void;
  currentUserInterests?: { _id: string; name: string }[];
}

// Map interest strings to icons
const interestIcons = {
  coffee: <Coffee size={14} />,
  music: <Music size={14} />,
  movies: <Film size={14} />,
  reading: <Book size={14} />,
  travel: <Globe size={14} />,
  // Add more interests as needed
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  onSwipe,
  loading = false,
  onViewFullProfile,
  currentUserInterests = [],
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeAnimation, setSwipeAnimation] = useState<string | null>(null);
  const [userInterests, setUserInterests] = useState<{ _id: string; name: string }[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      if (profile?._id) {
        try {
          setLoadingInterests(true);
          const response = await userApi.getUserInterests(profile._id);
          if (response.data?.data?.interests) {
            setUserInterests(response.data.data.interests);
          }
        } catch (error) {
          console.error('Error fetching interests:', error);
        } finally {
          setLoadingInterests(false);
        }
      }
    };

    fetchInterests();
  }, [profile?._id]);

  // If no profile is available
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[36rem] rounded-2xl bg-gray-800 text-white text-center p-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 mb-6 bg-gray-700 rounded-full flex items-center justify-center">
            <Search size={32} className="text-[#59a2b3]" />
          </div>{" "}
          <h3 className="text-2xl font-bold mb-4">
            Không còn hồ sơ nào để vuốt
          </h3>
          <p className="text-gray-400 mb-2 max-w-md">
            Chúng tôi đang tìm kiếm thêm người trong khu vực của bạn. Hãy thử
            lại sau hoặc điều chỉnh sở thích để xem thêm hồ sơ.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Bạn có thể đã xem hết tất cả hồ sơ phù hợp với sở thích của mình.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#48cbca] rounded-full text-white hover:bg-[#59a2b3] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Thử Lại</span>
            </button>{" "}
            <Link
              to="/setting"
              className="px-6 py-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Settings size={16} />
              <span>Điều Chỉnh Sở Thích</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleViewFullProfile = () => {
    if (onViewFullProfile) {
      onViewFullProfile();
    } else if (profile._id) {
      window.open(`/profile/${profile._id}`, "_blank");
    }
  };

  // Get user photos - default to profile picture if no photo array
  const photos =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : [profile.profile_picture || avatarPlaceholder];

  // Handle photo navigation
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 100;
    const isRightSwipe = distance < -100;

    if (isLeftSwipe) {
      setSwipeAnimation("swipe-left");
      setTimeout(() => {
        onSwipe("dislike");
        setSwipeAnimation(null);
      }, 300);
    } else if (isRightSwipe) {
      setSwipeAnimation("swipe-right");
      setTimeout(() => {
        onSwipe("like");
        setSwipeAnimation(null);
      }, 300);
    }

    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Add this function to check if an interest matches
  const isMatchingInterest = (interestId: string) => {
    return currentUserInterests.some(userInterest => userInterest._id === interestId);
  };

  return (
    <div
      className={`max-w-md mx-auto overflow-hidden rounded-2xl bg-gray-800 shadow-xl relative ${swipeAnimation}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main image with carousel navigation */}
      <div className="aspect-square relative">
        <img
          src={photos[currentPhotoIndex]}
          alt={`${profile.user_name}'s profile`}
          className="w-full h-full object-cover"
        />

        {/* Photo navigation controls */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Photo indicator dots */}
        {photos.length > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-8 rounded-full ${
                  i === currentPhotoIndex ? "bg-white" : "bg-white/50"
                }`}
              ></div>
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent"></div>

        {/* Main user info on top of the image */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-white">
                  {profile.user_name}
                </h2>
                {profile.gender && (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                  profile.gender === 'male' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : profile.gender === 'female' 
                    ? 'bg-pink-500/20 text-pink-400' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {profile.gender === 'male' ? (
                    <Mars size={16} />
                  ) : profile.gender === 'female' ? (
                    <Venus size={16} />
                  ) : (
                    <UserIcon size={16} />
                  )}
                  {profile.birthday && (
                    <span className="text-sm font-medium">
                      {Math.floor((new Date().getTime() - new Date(profile.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25))}
                    </span>
                  )}
                </span>
              )}
              </div>

              {profile.location && (
                <div className="flex items-center gap-1 text-gray-200 mt-1">
                  <MapPin size={14} />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleViewFullProfile}
              className="bg-white/20 backdrop-blur-sm text-white py-1 px-3 rounded-full text-xs hover:bg-white/30 transition-colors"
            >
              <Info size={14} className="inline mr-1" />
              Xem Hồ Sơ
            </button>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="p-4 h-2/6 flex flex-col justify-between">
        {/* Bio, job, education and interests */}
        <div>
          {/* Work & Education info */}
          <div className="mb-2 flex flex-wrap gap-4 text-gray-300 text-xs">
            {profile.occupation && (
              <div className="flex items-center gap-1">
                <Briefcase size={12} />
                <span>{profile.occupation}</span>
              </div>
            )}

            {profile.education && (
              <div className="flex items-center gap-1">
                <GraduationCap size={12} />
                <span>{profile.education}</span>
              </div>
            )}
          </div>

          {profile.bio && (
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-0 top-0 text-[#48cbca] text-xl font-serif">"</div>
                <p className="text-gray-200 text-sm pl-4 pr-4 py-1 line-clamp-2 bg-gray-700/30 rounded-lg">
                  {profile.bio}
                </p>
                <div className="absolute right-0 bottom-0 text-[#48cbca] text-xl font-serif">"</div>
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="flex flex-wrap gap-2 mb-4">
            {loadingInterests ? (
              <div className="text-gray-400 text-sm">Loading interests...</div>
            ) : userInterests.length > 0 ? (
              [...userInterests]
                .sort((a, b) => {
                  const aMatches = isMatchingInterest(a._id);
                  const bMatches = isMatchingInterest(b._id);
                  return bMatches ? 1 : aMatches ? -1 : 0;
                })
                .map((interest) => (
                  <div
                    key={interest._id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      isMatchingInterest(interest._id)
                        ? 'bg-[#48cbca] text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {interestIcons[
                      interest.name.toLowerCase() as keyof typeof interestIcons
                    ] || <Globe size={14} />}
                    <span>{interest.name}</span>
                  </div>
                ))
            ) : (
              <div className="text-gray-400 text-sm">No interests listed</div>
            )}
          </div>
        </div>
        {/* Swipe buttons - Layout: Left (dislike), Up (like), Right (superlike) */}
        <div className="flex justify-center items-center gap-4 mt-2">
          {/* Left - Dislike */}
          <button
            onClick={() => onSwipe("dislike")}
            disabled={loading}
            className="group bg-gray-700 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Không thích"
          >
            <X size={24} className="text-red-500 group-hover:text-white" />
          </button>

          {/* Up - Like */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onSwipe("like")}
              disabled={loading}
              className="group bg-gray-700 hover:bg-green-500 text-white p-4 mt-2 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:pointer-events-none mb-2"
              aria-label="Thích"
            >
              <Heart
                size={24}
                className="text-green-500 group-hover:text-white"
              />
            </button>
          </div>

          {/* Right - Superlike */}
          <button
            onClick={() => onSwipe("superlike")}
            disabled={loading}
            className="group bg-gray-700 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Siêu thích"
          >
            <Star size={24} className="text-blue-500 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
