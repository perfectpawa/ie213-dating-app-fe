import React, { useRef } from 'react';
import { Camera, Pencil, Mars, Venus, User as UserIcon } from 'lucide-react';
import { User } from '../../types/user';
import avatarPlaceholder from '../../assets/avatar_holder.png';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onProfilePictureChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCoverPictureChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onEditClick?: () => void;
  loading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = false,
  onProfilePictureChange,
  onCoverPictureChange,
  onEditClick,
  loading = false,
}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-white">{user.user_name}</h1>
            <span className="text-gray-400">
              {user.full_name}
            </span>
            {isOwnProfile && onEditClick && (
              <button
                onClick={onEditClick}
                className="ml-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
              >
                <Pencil size={16} />
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>

          {/* Gender and Age Info */}
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
    </div>
  );
};

export default ProfileHeader; 