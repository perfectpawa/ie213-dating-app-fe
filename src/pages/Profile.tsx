import React, { useState } from "react";
import Layout from "../components/layout/layout";
import { Pencil, Camera } from "lucide-react";

interface ProfileProps {
  username: string;
  bio?: string;
  interests?: string[];
  location?: string;
  age?: number;
}

const Profile: React.FC<ProfileProps> = ({
  username,
  bio,
  interests = [],
  location,
  age,
}) => {
  const [isEditing, setIsEditing] = useState(false);

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
                src="https://pbs.twimg.com/profile_images/3398056307/6949ebc8091957497f8a577ab29e5ca1_400x400.jpeg"
                alt={`${username}'s avatar`}
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
                <h1 className="text-3xl font-bold text-white">{username}</h1>
                <span className="text-gray-400">
                {age} - {location}
              </span>
              </div>


              {/* Bio */}
              <div className="mt-3.5">
                {/* <h2 className="flex flex-row text-xl font-semibold text-white mb-2">
                  About me
                </h2> */}
                <p className="flex flex-row text-gray-400">{bio}</p>
              </div>
            </div>

            {/* Interests */}
            <div className="mt-6">
              <h2 className=" text-xl font-semibold text-white mb-2">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2 mt-4 ">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#4edcd8] text-black rounded-full text-sm transition-transform duration-300 transform hover:scale-110 peer"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        {/* Photos Section */}
        <div className="mx-5 mt-5 mb-8 ">
          <h2 className="text-xl font-semibold text-white mb-4">Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/600/450?random=${item}`}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110 peer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Profile;
