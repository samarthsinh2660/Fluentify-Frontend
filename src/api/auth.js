import { API_BASE_URL, handleResponse } from './apiHelpers';

/**
 * Auth API Client
 * Clean API functions for authentication
 */

/**
 * Login user
 * @param {Object} credentials
 * @param {string} credentials.role - 'learner' or 'admin'
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{success: boolean, data: {token: string, user: object}}>}
 */
export const loginUser = async ({ role, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  return handleResponse(response);
};

/**
 * Sign up new user
 * @param {Object} credentials
 * @param {string} credentials.role - 'learner' or 'admin'
 * @param {string} credentials.name
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{success: boolean, data: {token: string, user: object}}>}
 */
export const signupUser = async ({ role, name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  return handleResponse(response);
};

/**
 * Get current user profile
 * @param {string} token - JWT token
 * @returns {Promise<{success: boolean, data: {user: object}}>}
 */
export const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  return handleResponse(response);
};

/**
 * Logout user (client-side)
 */
export const logoutUser = () => {
  localStorage.removeItem('jwt');
};
