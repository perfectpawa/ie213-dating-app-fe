import { Heart, X, Star } from "lucide-react";
import { User } from "../../types/user";
import avatarPlaceholder from "../../assets/avatar_holder.png";

interface MatchingCardProps {
  profile: User | null;
  onSwipe: (status: "like" | "dislike" | "superlike") => void;
  loading?: boolean;
}

const MatchingCard: React.FC<MatchingCardProps> = ({
  profile,
  onSwipe,
  loading = false,
}) => {
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96 rounded-2xl bg-gray-800 text-white text-center p-8">
        <div className="flex flex-col items-center">
          <span className="text-xl mb-4">Không còn hồ sơ nào để vuốt</span>
          <span className="text-gray-400">
            Hãy quay lại sau để có thêm lượt ghép đôi
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden text-gray-50 relative bg-gray-800 shadow-lg">
      <div className="relative h-96">
        <img
          src={profile.profile_picture || avatarPlaceholder}
          alt={`${profile.user_name}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h2 className="text-2xl font-bold">
            {profile.user_name}, {profile.age || "?"}
          </h2>
        </div>
      </div>

      <div className="p-6 bg-gray-800">
        <p className="text-gray-200 mb-4">{profile.bio || "Chưa có tiểu sử"}</p>
        {/* Swipe Buttons - Layout: Left (dislike), Up (like), Right (superlike) */}
        <div className="flex justify-center items-center gap-4 mt-2">
          {/* Left - Dislike */}
          <button
            onClick={() => onSwipe("dislike")}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
          >
            <X size={24} />
          </button>

          {/* Up - Like */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onSwipe("like")}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:pointer-events-none mb-2"
            >
              <Heart size={24} />
            </button>
          </div>

          {/* Right - Superlike (Love) */}
          <button
            onClick={() => onSwipe("superlike")}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Star size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingCard;
