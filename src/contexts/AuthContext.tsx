import { createContext, useEffect, useState, ReactNode, use } from "react";
import {UpdateUserDto, User} from "../types/user";
import { Interest } from "../types/interest";
import { authApi } from "../api/authApi";
import { useDispatch } from 'react-redux';
import { setAuthUser, clearAuthUser } from "../store/authSlice";


import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { userApi } from "@/api/userApi";

interface AuthContextType {
    user: User | null;
    interests: Interest[] | null;
    loading: boolean;
    error: Error | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resendOTP: (email: string) => Promise<void>;
    completeProfile: (data: FormData) => Promise<void>;
    completeInterest: (interests: string[]) => Promise<void>;
    updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [interests, setInterests] = useState<Interest[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const dispatch = useDispatch();

    const stateUser = useSelector((state: RootState) => state?.auth.user);

    useEffect(() => {
        const checkUser = async () => {
            try {
                setLoading(true);
                setUser(stateUser)

            } catch (err) {
                console.error('Error fetching user:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);


    const login = async (email: string, password: string) => {
        try {
            setError(null);
            // setLoading(true);
            const { data, error: loginError } = await authApi.login(email, password);

            if (loginError) throw loginError;
            if (!data?.user) throw new Error('No user data received from login');
            
            setUser(data.user as User);

            dispatch(setAuthUser(data.user as User));

        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err : new Error('Login failed'));
            throw err;
        } finally {
            // setLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const { data, error: signupError } = await authApi.signup(email, password);

            if (signupError) throw signupError;
            if (!data?.user) throw new Error('No user data received from signup');

            setUser(data.user as User);

            dispatch(setAuthUser(data.user as User));

        } catch (err) {
            console.error('Signup error:', err);
            setError(err instanceof Error ? err : new Error('Signup failed'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setLoading(true);
            const { error: logoutError } = await authApi.logout();
            
            if (logoutError) throw logoutError;
            
            setUser(null);
            // Clear both cookie and localStorage
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            localStorage.removeItem('token');
            dispatch(clearAuthUser());
        } catch (err) {
            console.error('Logout error:', err);
            setError(err instanceof Error ? err : new Error('Logout failed'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async (email: string) => {
        try {
            setError(null);
            setLoading(true);
            const { error: resendError } = await authApi.resendOTP(email);
            
            if (resendError) throw resendError;
        } catch (err) {
            console.error('Resend OTP error:', err);
            setError(err instanceof Error ? err : new Error('Failed to resend OTP'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completeProfile = async (data: FormData) => {
        try {
            setError(null);
            setLoading(true);

            if (!user) throw new Error('User not found');

            const { data: responseData, error: completeError } = await authApi.completeProfile(user._id, data);

            if (completeError) throw completeError;
            if (!responseData?.user) throw new Error('No user data received after completing profile');

            console.log(responseData.user);

            // Update both local state and Redux store
            const updatedUser = responseData.user as User;
            setUser(updatedUser);
            dispatch(setAuthUser(updatedUser));

        } catch (err) {
            console.error('Complete profile error:', err);
            setError(err instanceof Error ? err : new Error('Failed to complete profile'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completeInterest = async (interests: string[]) => {
        try {
            setError(null);
            setLoading(true);

            if (!user) throw new Error('User not found');

            const { data, error: completeError } = await authApi.completeInterest(user._id, interests);

            console.log('Complete interest response:', data);

            if (completeError) throw completeError;
            if (!data?.user) throw new Error('No user data received after completing interests');

            // Update both local state and Redux store
            const updatedUser = data.user as User;
            setUser(updatedUser);
            dispatch(setAuthUser(updatedUser));

        } catch (err) {
            console.error('Complete interest error:', err);
            setError(err instanceof Error ? err : new Error('Failed to complete interests'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        dispatch(setAuthUser(updatedUser));
    };

    useEffect(() => {
        // fecth user interests when user changes
        const fetchUserInterests = async () => {
            if (!user || !user._id) return;

            try {
                setLoading(true);
                const { data, error: interestsError } = await userApi.getUserInterests(user._id);

                if (interestsError) throw interestsError;
                if (!data?.data.interests) throw new Error('No interests data received');

                setInterests(data.data.interests);

            } catch (err) {
                console.error('Fetch user interests error:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch user interests'));
            } finally {
                setLoading(false);
            }
        }
        fetchUserInterests();
    }, [user]);

    const value = {
        user,
        interests,
        loading,
        error,
        login,
        signUp,
        logout,
        resendOTP,
        completeProfile,
        completeInterest,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};