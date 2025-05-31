import React, { useEffect, useState } from 'react';
import { userApi } from '../../api/userApi';
import { useAuth } from '@/hooks/useAuth';

interface Interest {
  name: string;
  highlighted: boolean;
}

interface InterestsSectionProps {
  userId: string;
}


const InterestsSection: React.FC<InterestsSectionProps> = ({ userId }) => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { interests: userInterests } = useAuth();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        const response = await userApi.getUserInterests(userId);

        console.log('Fetched interests:', response.data);

        const data = response.data;

        if (!data || data.status !== 'success') {
          throw new Error('Failed to fetch interests');
        }

        console.log('user:', userInterests);
        console.log('Interests data:', data.data.interests);

        if (data.status === 'success' && data.data.interests) {
          const formattedInterests = data.data.interests.map((interest) => ({
            name: interest.name,
            highlighted: userInterests?.some((ui) => ui._id === interest._id) || false,
          }));

          formattedInterests.sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));

          setInterests(formattedInterests);
        }
        
      } catch (err) {
        setError('Failed to load interests');
        console.error('Error fetching interests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-5">
          <h2 className="text-xl font-semibold text-white mb-4">Sở thích</h2>
          <div className="animate-pulse flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-700 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-5">
          <h2 className="text-xl font-semibold text-white mb-4">Sở thích</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-5">
        <h2 className="text-xl font-semibold text-white mb-4">
          Sở thích
        </h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {interests.map((interest, index) => (
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
  );
};

export default InterestsSection; 