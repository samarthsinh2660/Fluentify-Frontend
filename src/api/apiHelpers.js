/**
 * Shared API Helper Functions
 * Common utilities for API calls across all API modules
 */

// Base API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Handle API response and throw errors if needed
 * @param {Response} response - Fetch API response
 * @returns {Promise<any>} - Parsed JSON data
 */
export const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error?.message || data.message || 'Request failed',
      data
    };
  }
  
  return data;
};

/**
 * Get authorization header with JWT token
 * @returns {Object} - Headers object with Authorization
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('jwt');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
