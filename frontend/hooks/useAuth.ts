import { useCallback } from 'react';

export const useAuth = () => {
  const logout = useCallback(() => {
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  return {
    logout,
    isAuthenticated,
  };
}; 