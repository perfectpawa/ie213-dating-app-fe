import { useState } from "react";
import { useInterest } from "@/hooks/useInterest";
import { useCategories } from "@/hooks/useCategory";
import { useAuth } from "@/hooks/useAuth";
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Select your interests
        </h2>

        {loadingCategories || loadingInterests ? (
          <p className="text-gray-400">Đang tải dữ liệu sở thích...</p>
        ) : errorCategories || errorInterests ? (
          <p className="text-red-400">{errorCategories || errorInterests}</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto px-4">
            {categories.map((cat) => {
              const interestsInCategory = interests.filter(
                (interest) => String(interest.category_id) === String(cat._id)
              );

              return (
                <div key={cat._id}>
                  <h3 className="text-lg font-semibold mb-1 text-gray-300">
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interestsInCategory.map((interest) => (
                      <button
                        key={interest._id}
                        onClick={() => toggleInterest(interest._id)}
                        className={`px-[18px] py-[8px] rounded-[20px] transition ${selectedInterests.includes(interest._id)
                            ? "bg-teal-500 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600"
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

        <div className="mt-8">
          <button
            disabled={selectedInterests.length === 0}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition
              ${selectedInterests.length === 0
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500"
              }`
            }

            onClick={() => handleSelectedInterests()}
          >
            {selectedInterests.length === 0
              ? "Please select at least one interest"
              : `Save ${selectedInterests.length} interests`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteInterest;
