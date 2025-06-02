import React, { useState, useEffect } from 'react';
import { X, Tag, Loader2, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();
  // Update selected interests when modal opens or currentInterests changes
  useEffect(() => {
    if (isOpen) {
      console.log("Current interests:", currentInterests);
      const mappedIds = currentInterests.map(i => i._id);
      console.log("Mapped IDs:", mappedIds);
      setSelectedInterestIds(mappedIds);
    }
  }, [isOpen, currentInterests]);
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await interestApi.getAll();
        if (response.data?.data?.interests) {
          const interests = response.data.data.interests;
          setAllInterests(interests);
          
          // Lấy danh sách ID hiện tại từ currentInterests
          const currentIds = currentInterests.map(i => i._id);
          console.log("Current interest IDs:", currentIds);
          
          // Kiểm tra danh sách IDs từ API
          const apiIds = interests.map(i => i._id);
          console.log("API interest IDs:", apiIds);
          
          // So sánh để thấy sự khác biệt
          const difference = apiIds.filter(id => !currentIds.includes(id));
          console.log("Interests not in current selection:", difference);
        }
      } catch (err) {
        setError('Failed to load interests');
        console.error('Error fetching interests:', err);
      }
    };

    if (isOpen) {
      fetchInterests();
    }
  }, [isOpen, currentInterests]);
  const handleInterestToggle = (interestId: string) => {
    setSelectedInterestIds(prev => {
      console.log("Toggle interest:", interestId);
      console.log("Before toggle:", prev);
      const result = prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId];
      console.log("After toggle:", result);
      return result;
    });
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

  // Filter interests based on search term
  const filteredInterests = searchTerm.trim() !== '' 
    ? allInterests.filter(interest => 
        interest.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allInterests;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="bg-gray-800 flex items-center justify-between p-5 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-[#4edcd8]">
              <Tag size={20} />
            </span>
            Cập nhật sở thích
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sở thích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50"
            />
          </div>
        </div>

        {/* Selected interests counter */}
        <div className="px-4 py-2 bg-gray-800/20 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              Đã chọn: <span className="text-[#4edcd8] font-medium">{selectedInterestIds.length}</span> sở thích
            </span>              <div className="flex gap-2">
                {selectedInterestIds.length > 0 && (
                  <button
                    onClick={() => setSelectedInterestIds([])}
                    className="text-xs text-gray-400 hover:text-white"
                    title="Bỏ chọn tất cả"
                  >
                    Bỏ chọn tất cả
                  </button>
                )}
                <button
                  onClick={() => {
                    // Select all interests
                    const allIds = allInterests.map(i => i._id);
                    console.log("Selecting all interests:", allIds);
                    setSelectedInterestIds(allIds);
                  }}
                  className="text-xs text-[#4edcd8] hover:text-white"
                  title="Chọn tất cả"
                >
                  Chọn tất cả
                </button>
              </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto overflow-x-hidden p-4">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <span className="rounded-full bg-red-500/20 p-1">
                <X size={14} className="text-red-400" />
              </span>
              {error}
            </div>
          )}

          {loadingCategories ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-2" />
              <p>Đang tải danh mục...</p>
            </div>
          ) : errorCategories ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
              {errorCategories}
            </div>
          ) : (
            <div className="space-y-6">
              {searchTerm.trim() !== '' && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
                    <span className="w-2 h-2 bg-[#4edcd8] rounded-full mr-2"></span>
                    Kết quả tìm kiếm
                  </h3>
                  <div className="flex flex-wrap gap-2">                    {filteredInterests.length > 0 ? (
                      filteredInterests.map((interest) => (
                        <button
                          key={interest._id}
                          onClick={() => handleInterestToggle(interest._id)}
                          data-selected={selectedInterestIds.includes(interest._id) ? "true" : "false"}
                          data-id={interest._id}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium 
                            transition-all duration-200 transform hover:scale-105
                            ${selectedInterestIds.includes(interest._id)
                              ? "bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black shadow-lg shadow-[#4edcd8]/20"
                              : "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                            }
                          `}
                        >
                          #{interest.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">Không tìm thấy sở thích phù hợp</p>
                    )}
                  </div>
                </div>
              )}

              {searchTerm.trim() === '' && categories.map((cat) => {
                const interestsInCategory = allInterests.filter(
                  (interest) => String(interest.category_id) === String(cat._id)
                );

                if (interestsInCategory.length === 0) return null;

                return (
                  <div key={cat._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
                      <span className="w-2 h-2 bg-[#4edcd8] rounded-full mr-2"></span>
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
                              ? "bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black shadow-lg shadow-[#4edcd8]/20"
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

        {/* Footer */}        <div className="p-4 bg-gray-800/30 border-t border-gray-700/50">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Force refresh the selected interests
                  const currentSelected = [...selectedInterestIds];
                  setSelectedInterestIds([]);
                  setTimeout(() => setSelectedInterestIds(currentSelected), 100);
                  console.log("Refreshing selected state:", selectedInterestIds);
                }}
                className="px-4 py-2.5 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                title="Làm mới trạng thái highlight"
              >
                Làm mới
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || selectedInterestIds.length === 0}
              className={`
                px-6 py-2.5 rounded-lg font-medium flex items-center gap-2
                ${loading || selectedInterestIds.length === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black hover:shadow-lg hover:shadow-[#4edcd8]/20"
                }
                transition-all
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                selectedInterestIds.length === 0 ? 'Vui lòng chọn ít nhất một sở thích' : 'Cập nhật'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInterestsModal;