import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Get learner preferences
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getLearnerPreferences = async () => {
  const response = await fetch(`${API_BASE_URL}/api/preferences/learner`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Save learner preferences
 * @param {Object} preferences - User preferences data
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const saveLearnerPreferences = async (preferences) => {
  const response = await fetch(`${API_BASE_URL}/api/preferences/learner`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(preferences),
  });
  
  return handleResponse(response);
};
