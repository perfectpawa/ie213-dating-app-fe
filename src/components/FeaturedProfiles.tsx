import React, { useState, useEffect } from 'react';

interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  dob: {
    age: number;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

interface ProfileCardProps {
  user: RandomUser;
  index: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, index }) => {
  const tags = ["Du Lịch", "Âm Nhạc", "Thể Thao"];

  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-xl">
      <div className="aspect-[3/4] bg-gray-700 relative">
        <img 
          src={user.picture.large} 
          alt={`${user.name.first}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <h3 className="font-semibold text-sm text-white">
            {user.name.first}, {user.dob.age}
          </h3>
          <p className="text-xs text-gray-300">
            {user.location.city}
          </p>
        </div>
      </div>
      <div className="p-2">
        <div className="flex flex-wrap gap-1 mb-1">
          {tags.slice(index, index + 1).map((tag, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-[#1a3f3e] text-[#4edcd8] rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
        <button className="w-full px-2 py-1.5 bg-[#4edcd8] text-white rounded-lg text-xs font-medium hover:bg-[#3bc0bd] transition-colors duration-300">
          Xem Hồ Sơ
        </button>
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

const useRandomUsers = (count: number = 3) => {
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=us`);
        const data = await response.json();
        setUsers(data.results);
      } catch (error) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [count]);

  return { users, loading, error };
};

export const FeaturedProfiles: React.FC = () => {
  const { users, loading, error } = useRandomUsers(6);

  return (
    <section className="col-span-1">
      <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
        <p className="text-[#4edcd8] mr-2" />
        Hồ Sơ Nổi Bật
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {loading ? (
          <div className="col-span-2">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="col-span-2 text-red-500 text-center p-4">{error}</div>
        ) : (
          users.map((user, index) => (
            <ProfileCard key={user.picture.large} user={user} index={index} />
          ))
        )}
      </div>
    </section>
  );
}; 