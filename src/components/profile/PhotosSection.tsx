import React from "react";
import { Plus } from "lucide-react";
import { usePosts } from "../../hooks/usePosts";

interface PhotosSectionProps {
  userId: string;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ userId }) => {
  const { posts, loading, error } = usePosts(userId);

  return (
    <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-5">
        <h2 className="text-xl font-semibold text-white mb-4">
          Photos
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-red-500">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="aspect-square relative group">
                <img
                  src={post.image}
                  alt={post.content}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <p className="text-white text-sm p-2 text-center">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-gray-800 rounded-lg">
            <p className="text-gray-400 mb-4">No photos yet</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-black rounded-full hover:opacity-90 transition-opacity">
              <Plus size={20} />
              Create Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosSection; 