import { useState } from "react";
import { useInterest } from "@/hooks/useInterest";
import { useCategories } from "@/hooks/useCategory";
import { useAuth } from "@/hooks/useAuth";
import ParticlesBackground from "../components/layout/ParticlesBackground";
import { useNavigate } from "react-router-dom";

const CompleteInterest = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    interests,
    loading: loadingInterests,
    error: errorInterests,
  } = useInterest();
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  const { completeInterest } = useAuth();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSelectedInterests = async () => {
    console.log("Selected Interests:", selectedInterests);

    try {
      await completeInterest(selectedInterests);
      navigate("/home");
    } catch (error) {
      console.error("Error completing interests:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ParticlesBackground/>
      <div className="w-full max-w-3xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Select Your Interests
            </h2>
            <p className="text-gray-400">
              Choose the topics that interest you to help us find better matches
            </p>
          </div>

          {loadingCategories || loadingInterests ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : errorCategories || errorInterests ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
              {errorCategories || errorInterests}
            </div>
          ) : (
            <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar px-2">
              {categories.map((cat) => {
                const interestsInCategory = interests.filter(
                  (interest) => String(interest.category_id) === String(cat._id)
                );

                return (
                  <div key={cat._id} className="bg-gray-700/30 rounded-xl p-4">
                    <h3 className="text-xl font-semibold mb-3 text-white flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                      {cat.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {interestsInCategory.map((interest) => (
                        <button
                          key={interest._id}
                          onClick={() => toggleInterest(interest._id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            selectedInterests.includes(interest._id)
                              ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                              : "bg-gray-600/50 text-gray-200 hover:bg-gray-600"
                          }`}
                        >
                          {interest.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <button
              disabled={selectedInterests.length === 0}
              className={`w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                selectedInterests.length === 0
                  ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-lg shadow-teal-500/20"
              }`}
              onClick={handleSelectedInterests}
            >
              {selectedInterests.length === 0
                ? "Please select at least one interest"
                : `Save ${selectedInterests.length} interest${selectedInterests.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteInterest;
