import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/layout";
import { useProfile } from "../hooks/useProfile";
import PhotosSection from "../components/profile/PhotosSection";
import ProfileHeader from "../components/profile/ProfileHeader";
import InterestsSection from "../components/profile/InterestsSection";

import { userApi } from "../api/userApi";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, error, fetchUserPosts, fetchUserData } = useProfile();
  const [relationshipStatus, setRelationshipStatus] = useState<string | null>(null);
  const [relationshipLoading, setRelationshipLoading] = useState(false);

  const fetchRelationshipStatus = useCallback(async (targetUserId: string) => {
    try {
      console.log(relationshipLoading);
      setRelationshipLoading(true);
      const response = await userApi.getRelationship(targetUserId);
      if (response.data?.relationship) {
        setRelationshipStatus(response.data.relationship);
      }
    } catch (err) {
      console.error('Error fetching relationship status:', err);
    } finally {
      setRelationshipLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
      fetchUserPosts(userId);
      fetchRelationshipStatus(userId);
    }
  }, [userId, fetchRelationshipStatus]);

  const handleSwipeComplete = useCallback(() => {
    if (userId) {
      fetchRelationshipStatus(userId);
    }
  }, [userId, fetchRelationshipStatus]);

  // if (loading || relationshipLoading) {
  //   return <LoadingSpinner />;
  // }

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
        <ProfileHeader 
          user={user} 
          relationshipStatus={relationshipStatus} 
          onSwipeComplete={handleSwipeComplete}
        />

        {userId && <InterestsSection userId={userId} />}
        {userId && <PhotosSection userId={userId} />}
      </div>
    </Layout>
  );
};

export default UserProfile;
