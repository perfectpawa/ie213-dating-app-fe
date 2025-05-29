import React, { useRef } from 'react';
import { Camera, Pencil } from 'lucide-react';
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

          {/* Bio */}
          <div className="mt-3.5">
            <p className="flex flex-row mt-8 text-white">{user.bio}</p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {user.occupation && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="font-medium">Nghề nghiệp:</span>
                <span>{user.occupation}</span>
              </div>
            )}
            {user.education && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="font-medium">Học vấn:</span>
                <span>{user.education}</span>
              </div>
            )}
            {user.gender && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="font-medium">Giới tính:</span>
                <span>
                  {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                </span>
              </div>
            )}
            {user.birthday && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="font-medium">Ngày sinh:</span>
                <span>{new Date(user.birthday).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 