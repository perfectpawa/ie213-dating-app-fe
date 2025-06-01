import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { interestApi } from '../../api/interestApi';
import { useCategories } from '@/hooks/useCategory';

interface Interest {
  _id: string;
  name: string;
  category_id: string;
}

interface Category {
  _id: string;
  name: string;
}

interface UpdateInterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInterests: Interest[];
  onUpdate: (interestIds: string[]) => Promise<void>;
}

const UpdateInterestsModal: React.FC<UpdateInterestsModalProps> = ({
  isOpen,
  onClose,
  currentInterests,
  onUpdate,
}) => {
  const [allInterests, setAllInterests] = useState<Interest[]>([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  // Update selected interests when modal opens or currentInterests changes
  useEffect(() => {
    if (isOpen) {
      setSelectedInterestIds(currentInterests.map(i => i._id));
    }
  }, [isOpen, currentInterests]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await interestApi.getAll();
        if (response.data?.data?.interests) {
          setAllInterests(response.data.data.interests);
        }
      } catch (err) {
        setError('Failed to load interests');
        console.error('Error fetching interests:', err);
      }
    };

    if (isOpen) {
      fetchInterests();
    }
  }, [isOpen]);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterestIds(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await onUpdate(selectedInterestIds);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Update Interests</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 text-red-500">
            {error}
          </div>
        )}

        <div className="p-4 overflow-y-auto flex-1">
          {loadingCategories ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : errorCategories ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
              {errorCategories}
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((cat) => {
                const interestsInCategory = allInterests.filter(
                  (interest) => String(interest.category_id) === String(cat._id)
                );

                if (interestsInCategory.length === 0) return null;

                return (
                  <div key={cat._id} className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                      {cat.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {interestsInCategory.map((interest) => (
                        <button
                          key={interest._id}
                          onClick={() => handleInterestToggle(interest._id)}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium 
                            transition-all duration-200 transform hover:scale-105
                            ${selectedInterestIds.includes(interest._id)
                              ? "bg-gradient-to-r from-teal-400 to-teal-500 text-black shadow-lg shadow-teal-500/20"
                              : "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                            }
                          `}
                        >
                          #{interest.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || selectedInterestIds.length === 0}
              className={`
                px-4 py-2 rounded-md transition-all duration-200
                ${selectedInterestIds.length === 0
                  ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-400 to-teal-500 text-black hover:opacity-90"
                }
              `}
            >
              {loading 
                ? 'Saving...' 
                : selectedInterestIds.length === 0
                  ? 'Please select at least one interest'
                  : `Save ${selectedInterestIds.length} interest${selectedInterestIds.length > 1 ? 's' : ''}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInterestsModal; 