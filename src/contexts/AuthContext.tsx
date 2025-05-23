import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "../types/user";
import { authApi } from "../api/authApi";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resendOTP: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                setLoading(true);

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

            console.log("Login successful:", data.user);
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

    const value = {
        user,
        loading,
        error,
        login,
        signUp,
        logout,
        resendOTP,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};