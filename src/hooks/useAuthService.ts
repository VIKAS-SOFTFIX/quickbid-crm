import { useState } from 'react';
import { login as apiLogin, getProfile, UserProfile } from '../services/authService';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthService = () => {
  const { login: contextLogin, logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await contextLogin(email, password);
      return true;
    } catch (err) {
      setError('Invalid email or password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getProfile();
      return profile;
    } catch (err) {
      setError('Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    fetchProfile,
    user,
    loading,
    error,
  };
};