'use client';

import { createContext, useState, useContext, useEffect, ReactNode, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import authService from '../services/authService';

const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'auth_token';

interface LoginApiResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
      permissions: string[];
    };
  };
}

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem(USER_STORAGE_KEY);
          const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

          if (storedUser && storedToken) {
            try {
              const userData = JSON.parse(storedUser);
              console.log(userData,"userData");
              setUser(userData);
              setIsAuthenticated(true);
              authService.setAuthToken(storedToken);
            } catch (e) {
              console.error('Invalid user data in localStorage:', e);
              clearAuthData();
            }
          }
        }

        const currentUser = await authService.getCurrentUser();
        setUser(currentUser as unknown as AppUser);
        setIsAuthenticated(true);

        // Redirect to dashboard if already logged in and on login page
        if (pathname === '/login') {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();

        // If not logged in and not already on login, redirect to login
        if (pathname !== '/login') {
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.clearAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('https://api.quickbid.co.in/support/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginApiResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error('Login failed');
      }

      const token = data.data.token;
      const userData = data.data.user;

      authService.setAuthToken(token);

      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }

      setUser(userData);
      setIsAuthenticated(true);

      // Redirect to dashboard
      router.replace('/dashboard');

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    router.replace('/login');
    authService.logout().catch((err) => console.error('Logout API call failed:', err));
  };

  const refreshUserData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData as unknown as AppUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
