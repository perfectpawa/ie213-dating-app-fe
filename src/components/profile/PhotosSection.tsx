import React, { useState } from "react";
import { Plus, Heart, Edit2, Trash2 } from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import { useModal } from "@/contexts/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import { PostModal } from "../Modal/PostModal";
import DeletePostModal from "../Modal/DeletePostModal";
import UpdatePostModal from "../Modal/UpdatePostModal";
import CreatePostModal from "../Modal/CreatePostModal";
import { postApi } from "../../api/postApi";

interface PhotosSectionProps {
  userId: string;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ userId }) => {
  const { error, posts, refreshPosts } = usePosts(userId);
  const { openCreatePostModal } = useModal();
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [postToEdit, setPostToEdit] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  //make refreshPosts run after certain actions

  const handleLikeToggle = async (postId: string) => {
    try {
      await postApi.toggleLike(postId);
      await refreshPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleEditPost = (postId: string) => {
    setPostToEdit(postId);
  };

  const handleUpdatePost = async (content: string, image?: File) => {
    try {
      if (!postToEdit) return;
      await postApi.updatePost(postToEdit, content, image);
      await refreshPosts();
      setPostToEdit(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postApi.deletePost(postId);
      await refreshPosts();
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCreatePost = async (content: string, image: File) => {
    try {
      await postApi.createPost(content, image);
      await refreshPosts();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      <div className="mt-6 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Photos
            </h2>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-black rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Thêm ảnh mới
            </button>
          </div>
          
          {error ? (
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
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedPost(post._id)}
                  />
                  <div className="absolute inset-0 bg-black/80 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-white text-sm p-2 text-center">{post.content}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(post._id);
                          }}
                          className={`flex items-center gap-1 hover:text-[#4edcd8] transition-colors ${
                            user && post.likes.includes(user._id) ? 'text-red-500' : 'text-white'
                          }`}
                        >
                          <Heart
                            size={16}
                            fill={user && post.likes.includes(user._id) ? 'currentColor' : 'none'}
                          />
                          <span className="text-sm">{post.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {user && post.user._id === user._id && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post._id);
                        }}
                        className="p-1.5 bg-black/50 rounded-full text-white hover:text-[#4edcd8] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPostToDelete(post._id);
                        }}
                        className="p-1.5 bg-black/50 rounded-full text-white hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-800 rounded-lg">
              <p className="text-gray-400 mb-4">No photos yet</p>
              <button 
                onClick={() => openCreatePostModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-black rounded-full hover:opacity-90 transition-opacity"
              >
                <Plus size={20} />
                Create Post
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostModal
          post={posts.find(p => p._id === selectedPost)!}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onLikeToggle={handleLikeToggle}
          onRefresh={refreshPosts}
        />
      )}

      <DeletePostModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDeletePost(postToDelete)}
      />

      {postToEdit && (
        <UpdatePostModal
          isOpen={!!postToEdit}
          onClose={() => setPostToEdit(null)}
          onUpdatePost={handleUpdatePost}
          post={posts.find(p => p._id === postToEdit)!}
        />
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePost={handleCreatePost}
      />
    </>
  );
};

export default PhotosSection; 