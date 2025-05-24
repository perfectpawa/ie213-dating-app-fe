import React, { useState } from "react";
import Layout from "../components/layout/layout";
import { Pencil, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import PhotosSection from "../components/profile/PhotosSection";

import avatarPlaceholder from '../assets/avatar_holder.png';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
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

  return (
    <Layout>
      <div className="profile-container max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-pink-500 to-purple-500 relative">
            <img
              src="https://static1.srcdn.com/wordpress/wp-content/uploads/2023/04/ada-wong-resident-evil-4-helicopter.jpg"
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
            {/* Edit button */}
            <button
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-1.25 flex items-center justify-center shadow-md opacity-60 cursor-pointer hover:bg-gray-300"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save' : <Pencil size={20}/>}
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
              <span className="absolute bottom-0 right-0 p-1.5 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <Camera size={18} className="text-white" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
              </span>
            </div>

            {/* Profile Details */}
            <div className="mt-12">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-bold text-white">{user.user_name}</h1>
                <span className="text-gray-400">
                  {user.full_name}
                </span>
              </div>

              {/* Bio */}
              <div className="mt-3.5">
                <p className="flex flex-row mt-8 text-white">{user.bio}</p>
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
