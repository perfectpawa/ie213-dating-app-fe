import { createContext, useEffect, useState, ReactNode } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import { User } from "../types/user";
import { userApi } from "../api/userApi";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: Error | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch user profile from backend
    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
        try {
            setError(null);
            setLoading(true);

            // Get user by auth_id
            const { data: user, error: fetchError } = await userApi.getUserByAuthId(supabaseUser.id);
            
            if (fetchError) throw fetchError;
            
            // If user exists, set it
            if (user) {
                setUser(user);
            } else {
                // If user doesn't exist in backend, create it
                const { data: newUser, error: createError } = await userApi.createUser({
                    auth_id: supabaseUser.id,
                    email: supabaseUser.email!,
                    username: supabaseUser.email!.split('@')[0],
                    completeSetup: false,
                });

                if (createError) throw createError;
                setUser(newUser);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                setSession(data.session);

                if (data.session?.user) {
                    await fetchUserProfile(data.session.user);
                }
            } catch (err) {
                console.error('Error fetching session:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch session'));
            } finally {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            
            if (session?.user) {
                await fetchUserProfile(session.user);
            } else {
                setUser(null);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);

            // 1. Login with Supabase
            const { data: { user: supabaseUser }, error: authError } = 
                await supabase.auth.signInWithPassword({ email, password });
            
            if (authError) throw authError;
            if (!supabaseUser) throw new Error('No user returned from login');

            // 2. Fetch user profile from backend
            await fetchUserProfile(supabaseUser);
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err : new Error('Login failed'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, username: string) => {
        try {
            setError(null);
            setLoading(true);

            // 1. Sign up with Supabase
            const { data: { user: supabaseUser }, error: authError } = 
                await supabase.auth.signUp({ email, password });
            
            if (authError) throw authError;
            if (!supabaseUser) throw new Error('No user returned from signup');

            // 2. Create user in backend
            const { error: profileError } = await userApi.createUser({
                auth_id: supabaseUser.id,
                email: supabaseUser.email!,
                username,
                completeSetup: false,
            });

            if (profileError) throw profileError;

            // 3. Fetch the created user profile
            await fetchUserProfile(supabaseUser);
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
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
        } catch (err) {
            console.error('Logout error:', err);
            setError(err instanceof Error ? err : new Error('Logout failed'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        try {
            setError(null);
            setLoading(true);
            if (!user) throw new Error('No user logged in');

            const { data: updatedUser, error: updateError } = 
                await userApi.updateUser(user.id, data);
            
            if (updateError) throw updateError;
            setUser(updatedUser);
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err instanceof Error ? err : new Error('Profile update failed'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                session, 
                loading, 
                error,
                login, 
                signUp, 
                logout,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};