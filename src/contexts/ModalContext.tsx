import React, { createContext, useContext, useState, ReactNode } from 'react';
import CreatePostModal from '../components/Modal/CreatePostModal';
import UpdateProfileModal from '../components/Modal/UpdateProfileModal';
import UpdateInterestsModal from '../components/Modal/UpdateInterestsModal';
import { User } from '../types/user';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types/post';

interface Interest {
  _id: string;
  name: string;
}

interface ModalContextType {
    openCreatePostModal: () => void;
    closeCreatePostModal: () => void;
    openUpdateProfileModal: (user: User, onUpdate: (user: User) => void) => void;
    closeUpdateProfileModal: () => void;
    openUpdateInterestsModal: (currentInterests: Interest[], onUpdate: (interestIds: string[]) => Promise<void>) => void;
    closeUpdateInterestsModal: () => void;
    posts: Post[];
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const { createPost, refreshPosts, posts } = usePosts(user?._id || '');

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState(false);
    const [isUpdateInterestsModalOpen, setIsUpdateInterestsModalOpen] = useState(false);
    const [updateProfileData, setUpdateProfileData] = useState<{
        user: User;
        onUpdate: (user: User) => void;
    } | null>(null);
    const [updateInterestsData, setUpdateInterestsData] = useState<{
        currentInterests: Interest[];
        onUpdate: (interestIds: string[]) => Promise<void>;
    } | null>(null);

    const openCreatePostModal = () => setIsCreatePostModalOpen(true);
    const closeCreatePostModal = () => setIsCreatePostModalOpen(false);

    const openUpdateProfileModal = (user: User, onUpdate: (user: User) => void) => {
        setUpdateProfileData({ user, onUpdate });
        setIsUpdateProfileModalOpen(true);
    };

    const closeUpdateProfileModal = () => {
        setIsUpdateProfileModalOpen(false);
        setUpdateProfileData(null);
    };

    const openUpdateInterestsModal = (currentInterests: Interest[], onUpdate: (interestIds: string[]) => Promise<void>) => {
        setUpdateInterestsData({ currentInterests, onUpdate });
        setIsUpdateInterestsModalOpen(true);
    };

    const closeUpdateInterestsModal = () => {
        setIsUpdateInterestsModalOpen(false);
        setUpdateInterestsData(null);
    };

    const handleCreatePost = async (content: string, image: File) => {
        try {
            console.log("Create Post...")
            await createPost(content, image);
        } catch (error) {
            console.error('Error creating post:', error);
        }
        
        await refreshPosts();
        closeCreatePostModal();
    };

    return (
        <ModalContext.Provider
            value={{
                openCreatePostModal,
                closeCreatePostModal,
                openUpdateProfileModal,
                closeUpdateProfileModal,
                openUpdateInterestsModal,
                closeUpdateInterestsModal,
                posts
            }}
        >
            {children}

            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={closeCreatePostModal}
                onCreatePost={handleCreatePost}
            />

            {updateProfileData && (
                <UpdateProfileModal
                    isOpen={isUpdateProfileModalOpen}
                    onClose={closeUpdateProfileModal}
                    user={updateProfileData.user}
                    onUpdate={updateProfileData.onUpdate}
                />
            )}

            {updateInterestsData && (
                <UpdateInterestsModal
                    isOpen={isUpdateInterestsModalOpen}
                    onClose={closeUpdateInterestsModal}
                    currentInterests={updateInterestsData.currentInterests}
                    onUpdate={updateInterestsData.onUpdate}
                />
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}; 