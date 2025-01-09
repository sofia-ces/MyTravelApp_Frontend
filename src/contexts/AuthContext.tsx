import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    handleLogin: (newToken: string) => Promise<void>;
    handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadToken = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem('authToken');
            setToken(storedToken || null);
        } catch (error) {
            setError('Error loading token from localStorage.');
        } finally {
            setIsLoading(false);
        }
    }, [setToken, setError]);

    useEffect(() => {
        loadToken();
    }, [loadToken]);

    const handleLogin = async (storedToken: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const storedToken = localStorage.getItem('authToken');
         

            setToken(storedToken);
            localStorage.setItem('authToken', storedToken);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            setToken(null);
            localStorage.removeItem('authToken');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = { token, setToken, isLoading, setIsLoading, error, setError, handleLogin, handleLogout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
   // console.log(context);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};