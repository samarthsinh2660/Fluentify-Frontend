import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * User Management API Client (Admin only)
 * API functions for admin to manage learner users
 */

/**
 * Get all learners with pagination and search
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search query (optional)
 * @returns {Promise<{success: boolean, data: Array, meta: Object}>}
 */
export const getAllLearners = async ({ page = 1, limit = 10, search = '' }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/learners?${params.toString()}`,
    {
      method: 'GET',
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};

/**
 * Get learner by ID with detailed stats
 * @param {string|number} learnerId - Learner ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getLearnerById = async (learnerId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/learners/${learnerId}`,
    {
      method: 'GET',
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};

/**
 * Update learner details (name, email)
 * @param {string|number} learnerId - Learner ID
 * @param {Object} data
 * @param {string} data.name - New name
 * @param {string} data.email - New email
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const updateLearner = async (learnerId, { name, email }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/learners/${learnerId}`,
    {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ name, email }),
    }
  );
  
  return handleResponse(response);
};

/**
 * Update learner password
 * @param {string|number} learnerId - Learner ID
 * @param {string} password - New password
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const updateLearnerPassword = async (learnerId, password) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/learners/${learnerId}/password`,
    {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ password }),
    }
  );
  
  return handleResponse(response);
};

/**
 * Delete learner and all related data
 * @param {string|number} learnerId - Learner ID
 * @returns {Promise<{success: boolean}>}
 */
export const deleteLearner = async (learnerId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/learners/${learnerId}`,
    {
      method: 'DELETE',
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};

/**
 * Get learner's courses
 * @param {string|number} learnerId - Learner ID
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getLearnerCourses = async (learnerId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/learners/${learnerId}/courses`,
    {
      method: 'GET',
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};
