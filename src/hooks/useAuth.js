import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser, getUserProfile, logoutUser } from '../api/auth';

/**
 * Hook for login mutation
 * @returns {Object} mutation object with mutate, isLoading, error, etc.
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store token
      if (data.data?.token) {
        localStorage.setItem('jwt', data.data.token);
      }
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Hook for signup mutation
 * @returns {Object} mutation object with mutate, isLoading, error, etc.
 */
export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      // Store token
      if (data.data?.token) {
        localStorage.setItem('jwt', data.data.token);
      }
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Hook to get current user profile
 * @returns {Object} query object with data, isLoading, error, etc.
 */
export const useUserProfile = () => {
  const token = localStorage.getItem('jwt');

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getUserProfile(token),
    enabled: !!token, // Only run if token exists
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for logout
 * @returns {Function} logout function
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    logoutUser();
    queryClient.clear(); // Clear all cached data
    navigate('/login');
  };
};

/**
 * Hook to check if user is authenticated
 * @returns {boolean} true if user has valid token
 */
export const useIsAuthenticated = () => {
  const token = localStorage.getItem('jwt');
  
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
