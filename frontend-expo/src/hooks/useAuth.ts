import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      setIsAuthenticated(true);
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, redirect to sign-in
      router.replace('/sign-in');
    }
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/sign-in');
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
    checkAuthStatus,
  };
};
