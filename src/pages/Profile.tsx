import React, { useState, useRef } from "react";
import Layout from "../components/layout/layout";
import { Pencil, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import PhotosSection from "../components/profile/PhotosSection";
import { userApi } from "../api/userApi";
import avatarPlaceholder from '../assets/avatar_holder.png';
import { useModal } from "../contexts/ModalContext";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { openUpdateProfileModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Array of interests with highlighted ones
  const userInterests = [
    { name: "gaming", highlighted: true },
    { name: "anime", highlighted: true },
    { name: "music", highlighted: false },
    { name: "film", highlighted: false },
    { name: "photo", highlighted: false },
    { name: "leon", highlighted: false },
    { name: "japan", highlighted: false },
    { name: "vietnam", highlighted: false },
    { name: "punch", highlighted: false },
    { name: "kick", highlighted: false },
    { name: "gun", highlighted: false },
    { name: "knife", highlighted: false },
    { name: "sport", highlighted: false },
    { name: "football", highlighted: false },
    { name: "isekai", highlighted: false },
  ];

  if (!user) {
    return null; // or a loading state
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const response = await userApi.updateProfilePicture(file);
      if (response.data?.data?.user) {
        updateUser(response.data.data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const response = await userApi.updateCoverPicture(file);
      if (response.data?.data?.user) {
        updateUser(response.data.data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cover picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-container max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-pink-500 to-purple-500 relative">
            <img
              src={user.cover_picture || "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/04/ada-wong-resident-evil-4-helicopter.jpg"}
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
            {/* Edit button */}
            <button
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-1.25 flex items-center justify-center shadow-md opacity-60 cursor-pointer hover:bg-gray-300"
              onClick={() => coverInputRef.current?.click()}
              disabled={loading}
            >
              <Camera size={20} />
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverPictureChange}
                accept="image/*"
                className="hidden"
              />
            </button>
          </div>

          {/* Profile Info Section */}
          <div className="px-6 py-8 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <img
                src={user.profile_picture || avatarPlaceholder}
                alt={`${user.user_name}'s avatar`}
                className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
              />
              <span 
                className="absolute bottom-0 right-0 p-1.5 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700" 
                onClick={() => avatarInputRef.current?.click()}
              >
                <Camera size={18} className="text-white" />
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
              </span>
            </div>

            {/* Profile Details */}
            <div className="mt-12">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-bold text-white">{user.user_name}</h1>
                <span className="text-gray-400">
                  {user.full_name}
                </span>
                <button
                  onClick={() => openUpdateProfileModal(user, updateUser)}
                  className="ml-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
                >
                  <Pencil size={16} />
                  <span>Chỉnh sửa</span>
                </button>
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

        <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {/* Interests */}
          <div className="px-6 py-5">
            <h2 className="text-xl font-semibold text-white mb-4">
              Sở thích
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {userInterests.map((interest, index) => (
                <span
                  key={index}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium 
                    hover:scale-105 transition-transform duration-300 cursor-pointer
                    ${interest.highlighted 
                      ? "bg-gradient-to-r from-teal-400 to-teal-500 text-black" 
                      : "bg-black text-white border border-gray-700"}
                  `}
                >
                  #{interest.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <PhotosSection userId={user._id} />
      </div>
    </Layout>
  );
};

export default Profile;
