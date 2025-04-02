'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing user data in cookies
    const userData = Cookies.get('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll use the dummy users
      const DUMMY_USERS = [
        {
          email: 'admin@quickbid.co.in',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User',
        },
        {
          email: 'sales@quickbid.co.in',
          password: 'sales123',
          role: 'sales',
          name: 'Sales User',
        },
        {
          email: 'manager@quickbid.co.in',
          password: 'manager123',
          role: 'manager',
          name: 'Manager User',
        },
        {
          email: 'demonstrator@quickbid.co.in',
          password: 'demo123',
          role: 'demonstrator',
          name: 'Demonstrator User',
        },
      ];

      const user = DUMMY_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const { password: _, ...userData } = user;
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 