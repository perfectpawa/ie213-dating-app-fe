import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/layout";
import { useProfile } from "../hooks/useProfile";
import PhotosSection from "../components/profile/PhotosSection";
import ProfileHeader from "../components/profile/ProfileHeader";
import LoadingSpinner from "../components/LoadingSpinner";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading, error, fetchUserPosts, fetchUserData } = useProfile();

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
        <ProfileHeader user={user} />
        {userId && <PhotosSection userId={userId} />}
      </div>
    </Layout>
  );
};

export default UserProfile;
