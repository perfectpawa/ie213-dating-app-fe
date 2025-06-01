import React, { useEffect, useState, useCallback } from 'react';
import { userApi } from '../../api/userApi';
import { useAuth } from '@/hooks/useAuth';
import { Edit2 } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';

interface Interest {
  _id: string;
  name: string;
  highlighted: boolean;
}

interface InterestsSectionProps {
  userId: string;
  isOwnProfile?: boolean;
  onUpdateInterests?: (interestIds: string[]) => Promise<void>;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ 
  userId, 
  isOwnProfile = false,
  onUpdateInterests 
}) => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openUpdateInterestsModal } = useModal();

  const { interests: userInterests } = useAuth();

  const fetchInterests = useCallback(async () => {
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
          _id: interest._id,
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
  }, [userId, userInterests]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const handleUpdateInterests = async (interestIds: string[]) => {
    if (onUpdateInterests) {
      await onUpdateInterests(interestIds);
      // Refresh interests after update
      await fetchInterests();
    }
  };

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Sở thích
          </h2>
          {isOwnProfile && onUpdateInterests && (
            <button
              onClick={() => openUpdateInterestsModal(
                interests.map(i => ({ _id: i._id, name: i.name })),
                handleUpdateInterests
              )}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <Edit2 size={16} />
              <span className="text-sm">Chỉnh sửa</span>
            </button>
          )}
        </div>
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