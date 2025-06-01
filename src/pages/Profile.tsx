import React, { useState } from "react";
import Layout from "../components/layout/layout";
import { useAuth } from "../hooks/useAuth";
import PhotosSection from "../components/profile/PhotosSection";
import ProfileHeader from "../components/profile/ProfileHeader";
import InterestsSection from "../components/profile/InterestsSection";
import { userApi } from "../api/userApi";
import { interestApi } from "../api/interestApi";
import { useModal } from "../contexts/ModalContext";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { openUpdateProfileModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return null;
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

  const handleUpdateInterests = async (interests: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await interestApi.updateInterests(interests);
      if (response.data?.data?.user) {
        updateUser(response.data.data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <ProfileHeader
          user={user}
          isOwnProfile={true}
          onProfilePictureChange={handleProfilePictureChange}
          onCoverPictureChange={handleCoverPictureChange}
          onEditClick={() => openUpdateProfileModal(user, updateUser)}
          loading={loading}
        />

        <InterestsSection 
          userId={user._id} 
          isOwnProfile={true}
          onUpdateInterests={handleUpdateInterests}
        />
        
        <PhotosSection userId={user._id} />
      </div>
    </Layout>
  );
};

export default Profile;
