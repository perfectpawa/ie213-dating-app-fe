import { useState, useEffect, useCallback, useRef } from 'react';
import { swipeApi } from '../api/swipeApi';
import { userApi } from '@/api/userApi';
import { User } from '../types/user';
import { Match, Swipe } from '../types/swipe';
import { useAuth } from './useAuth';


export const useSwipe = () => {
    const { user } = useAuth();
    const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentProfile, setCurrentProfile] = useState<User | null>(null);
    const [swipeResults, setSwipeResults] = useState<{
        swipe?: Swipe;
        match?: Match;
    } | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMoreProfiles, setHasMoreProfiles] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [swipedUsers, setSwipedUsers] = useState<User[]>([]);
    
    // Add a ref to track initial load
    const initialLoadComplete = useRef(false);

    // Fetch potential matches (profiles to swipe)
    const fetchPotentialMatches = useCallback(async (refresh: boolean = false) => {
        if (!user?._id) return;

        try {
            setLoading(true);
            setError(null);
            
            if (refresh) {
                setRefreshing(true);
                setPage(1);
            }
            
            const currentPage = refresh ? 1 : page;
            
            const response = await swipeApi.getPotentialMatches(user._id);
            
            if (response.data?.data?.potentialMatches) {
                const newProfiles = response.data.data.potentialMatches;
                
                if (refresh) {
                    setPotentialMatches(newProfiles);
                } else {
                    setPotentialMatches(prev => [...prev, ...newProfiles]);
                }
                
                // Set current profile if we don't have one yet
                if ((!currentProfile || refresh) && newProfiles.length > 0) {
                    setCurrentProfile(newProfiles[0]);
                }
                
                // Check if we have more profiles to fetch
                setHasMoreProfiles(newProfiles.length > 0);
                
                // If we got profiles, increment the page for next fetch
                if (newProfiles.length > 0) {
                    setPage(currentPage + 1);
                }
            } else {
                // No profiles returned
                setHasMoreProfiles(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch potential matches');
            console.error('Error fetching potential matches:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?._id, page, currentProfile]);

    // Fetch user's matches
    const fetchMatches = useCallback(async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await swipeApi.getUserMatches(user._id);
            if (response.data?.data?.matches) {
                setMatches(response.data.data.matches);
            }

            console.log(await userApi.getMatchedUsers())

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch matches');
            console.error('Error fetching matches:', err);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    // Fetch matched users
    const fetchSwipedUsers = useCallback(async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await userApi.getSwipedUsers();
            if (response.data?.data?.users) {
                setSwipedUsers(response.data.data.users);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch matched users');
            console.error('Error fetching matched users:', err);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    // Load more profiles when running low - with debounce
    const loadMoreProfiles = useCallback(async () => {
        if (potentialMatches.length < 5 && hasMoreProfiles && !loading) {
            await fetchPotentialMatches();
        }
    }, [potentialMatches.length, hasMoreProfiles, loading, fetchPotentialMatches]);

    // Fix refreshPotentialMatches to actually update state
    const refreshPotentialMatches = async () => {
        if (!user?._id || refreshing) return;
        
        setRefreshing(true);
        try {
            // Reuse the existing fetch function with refresh=true
            await fetchPotentialMatches(true);
        } catch (error) {
            console.error('Error refreshing potential matches:', error);
            setHasMoreProfiles(false);
        } finally {
            setRefreshing(false);
        }
    };

    // Initialize by fetching potential matches when user is available - BUT ONLY ONCE
    useEffect(() => {
        if (user?._id && !initialLoadComplete.current) {
            initialLoadComplete.current = true;
            fetchPotentialMatches(true);
            fetchMatches();
            fetchSwipedUsers();
        }
    }, [user?._id, fetchPotentialMatches, fetchMatches, fetchSwipedUsers]);

    // Check if we need to load more profiles when currentProfile changes
    useEffect(() => {
        if (initialLoadComplete.current && currentProfile === null && hasMoreProfiles) {
            loadMoreProfiles();
        }
    }, [currentProfile, loadMoreProfiles, hasMoreProfiles]);

    // Handle swipe action (like, dislike, superlike)
    const handleSwipe = async (swipedUserId: string, status: 'like' | 'dislike' | 'superlike') => {
        if (!user?._id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await swipeApi.createSwipe(user._id, swipedUserId, status);
            
            if (response.data?.data) {
                setSwipeResults(response.data.data);
                
                // If there was a match, update the matches list and add match notification
                if (response.data.data.match) {
                    const match = response.data.data.match;
                    setMatches(prev => [match, ...prev]);
                    
                    // Get the matched user details
                    const matchedUser = potentialMatches.find(p => p._id === swipedUserId);
                    if (matchedUser) {
                        // TODO: Add notification
                    }
                } else if (status === 'like' || status === 'superlike') {
                    // Add like notification (for the other user) - in a real app this would be handled by the server
                    // This is just for demo/testing purposes
                    const swipedUser = potentialMatches.find(p => p._id === swipedUserId);
                    if (swipedUser) {
                        console.log(`Swiped ${status} on ${swipedUser.user_name}`);
                    }
                }
                
                // Remove the swiped profile from potential matches
                setPotentialMatches(prev => prev.filter(profile => profile._id !== swipedUserId));
                
                // Move to next profile
                const nextProfile = potentialMatches.find(profile => profile._id !== swipedUserId && profile._id !== currentProfile?._id);
                setCurrentProfile(nextProfile || null);
                
                // If we're running low on profiles, fetch more - but do it after a brief delay
                setTimeout(() => {
                    if (potentialMatches.length < 3) {
                        loadMoreProfiles();
                    }
                }, 500);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process swipe');
            console.error('Error processing swipe:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        potentialMatches,
        currentProfile,
        matches,
        swipedUsers,
        loading,
        refreshing,
        error,
        swipeResults,
        hasMoreProfiles,
        handleSwipe,
        refreshPotentialMatches,
        refreshMatches: fetchMatches,
        loadMoreProfiles
    };
};
