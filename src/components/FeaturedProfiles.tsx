import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { interestApi } from '../api/interestApi';
import { User } from '../types/user';
import { Interest } from '../types/interest';
import {Link} from "react-router-dom";

interface ProfileCardProps {
  user: User;
  interestMap: Map<string, string>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, interestMap }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-xl">
      <div className="aspect-[3/4] bg-gray-700 relative">
        <img 
          src={user.profile_picture}
          alt={`${user.full_name}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <h3 className="font-semibold text-sm text-white">
            {user.full_name}
          </h3>
        </div>
      </div>
      <div className="p-2">
        <div className="flex flex-wrap gap-1 mb-1">
          {user.interests?.slice(0, 2).map((interestId, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-[#1a3f3e] text-[#4edcd8] rounded-full text-xs font-medium">
              {interestMap.get(interestId) || 'Loading...'}
            </span>
          ))}
        </div>
        <Link to={`/profile/${user._id}`}>
          <div className="w-full px-2 py-1.5 bg-[#4edcd8] text-white rounded-lg text-xs font-medium hover:bg-[#3bc0bd] transition-colors duration-300">
            Xem Hồ Sơ
          </div>
        </Link>
      </div>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="py-10 text-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4edcd8] border-r-transparent"></div>
    <p className="text-white mt-4">Đang tải...</p>
  </div>
);

export const FeaturedProfiles: React.FC = () => {
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [interestMap, setInterestMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch interests first
        const interestsResponse = await interestApi.getAll();
        if (interestsResponse.data?.status === 'success') {
          const interests = interestsResponse.data.data.interests;
          const newInterestMap = new Map(interests.map(interest => [interest._id, interest.name]));
          setInterestMap(newInterestMap);
        }

        // Then fetch users
        const { data } = await userApi.getOtherUsers();
        if (data?.status === 'success') {
          const shuffled = [...data.data.users].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 6);
          setRecommendedUsers(selected);
        } else {
          setError('Không thể tải người dùng nổi bật');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(
      (error) => console.error('Error in useEffect:', error)
    );
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <>
          {/* Top Profile - Hồ sơ nổi bật nhất */}
          {recommendedUsers.length > 0 && (
            <div className="mb-4">
              <div className="bg-gradient-to-br from-[#1a3f3e] to-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                <div className="aspect-[3/2] relative">
                  <img
                    src={recommendedUsers[0].profile_picture}
                    alt={`${recommendedUsers[0].full_name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#4edcd8] text-white rounded-full p-2 shadow">
                    <span className="text-xs font-bold">#1</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="font-semibold text-lg text-white">
                      {recommendedUsers[0].full_name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recommendedUsers[0].interests?.slice(0, 3).map((interestId, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#1a3f3e] text-[#4edcd8] rounded-full text-xs font-medium">
                          {interestMap.get(interestId) || '...'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to={`/profile/${recommendedUsers[0]._id}`} className="block p-3 text-center">
                  <div className="w-full px-3 py-2 bg-[#4edcd8] text-white rounded-lg text-sm font-medium hover:bg-[#3bc0bd] transition-colors duration-300">
                    Xem hồ sơ
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Other Profiles */}
          <div className="grid grid-cols-2 gap-3">
            {recommendedUsers.slice(1, 5).map((user, index) => (
              <ProfileCard key={index} user={user} interestMap={interestMap} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};