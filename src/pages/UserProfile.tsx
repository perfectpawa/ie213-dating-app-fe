import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/layout";
import { useProfile } from "../hooks/useProfile";
import PhotosSection from "../components/profile/PhotosSection";
import LoadingSpinner from "../components/LoadingSpinner";
import avatarPlaceholder from "../assets/avatar_holder.png";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, userPosts, loading, error, fetchUserPosts, fetchUserData } =
    useProfile();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
      fetchUserPosts(userId);
    }
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-4 text-gray-500">
        Không tìm thấy người dùng
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gray-700 relative">
            {/* Add cover photo here if available */}
          </div>

          <div className="px-6 py-8 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <img
                src={user.profile_picture || avatarPlaceholder}
                alt={`${user.user_name}'s avatar`}
                className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
              />
            </div>

            {/* Profile Details */}
            <div className="mt-12">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-bold text-white">
                  {user.user_name}
                </h1>
                <span className="text-gray-400">{user.full_name}</span>
              </div>

              {/* Bio */}
              <div className="mt-3.5">
                <p className="flex flex-row mt-8 text-white">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        {userId && <PhotosSection userId={userId} />}
      </div>
    </Layout>
  );
};

export default UserProfile;
