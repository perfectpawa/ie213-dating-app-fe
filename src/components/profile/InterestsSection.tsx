import React from 'react';

interface Interest {
  name: string;
  highlighted: boolean;
}

interface InterestsSectionProps {
  interests: Interest[];
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ interests }) => {
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