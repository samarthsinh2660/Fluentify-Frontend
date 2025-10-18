/**
 * Contests API Module
 * Handles all contest-related API calls for both learners and admins
 */

import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

const CONTESTS_BASE_URL = `${API_BASE_URL}/api/contests`;

// ============= LEARNER CONTEST APIs =============

/**
 * Browse published contests
 * @param {string} language - Filter by language (optional)
 * @returns {Promise<Object>} - List of contests
 */
export const browseContests = async (language = null) => {
  const url = language 
    ? `${CONTESTS_BASE_URL}?language=${encodeURIComponent(language)}`
    : CONTESTS_BASE_URL;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Get contest details
 * @param {number} contestId - Contest ID
 * @returns {Promise<Object>} - Contest details
 */
export const getContestDetails = async (contestId) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/${contestId}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Submit contest answers
 * @param {number} contestId - Contest ID
 * @param {Object} submission - Submission data
 * @param {Array<string>} submission.answers - Array of answers
 * @param {number} submission.timeTaken - Time taken in seconds
 * @returns {Promise<Object>} - Submission results
 */
export const submitContestAnswers = async (contestId, { answers, timeTaken }) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/${contestId}/submit`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ answers, timeTaken }),
  });
  return handleResponse(response);
};

/**
 * Get contest leaderboard
 * @param {number} contestId - Contest ID
 * @param {number} limit - Number of entries to fetch
 * @returns {Promise<Object>} - Leaderboard data
 */
export const getContestLeaderboard = async (contestId, limit = 100) => {
  const response = await fetch(
    `${CONTESTS_BASE_URL}/${contestId}/leaderboard?limit=${limit}`,
    {
      method: 'GET',
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};

/**
 * Get user's submission for a contest
 * @param {number} contestId - Contest ID
 * @returns {Promise<Object>} - User's submission data
 */
export const getMySubmission = async (contestId) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/${contestId}/my-submission`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

// ============= ADMIN CONTEST APIs =============

/**
 * Generate contest with AI
 * @param {Object} params - Contest generation parameters
 * @returns {Promise<Object>} - Generated contest
 */
export const generateContest = async (params) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/generate`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(params),
  });
  return handleResponse(response);
};

/**
 * Create contest manually
 * @param {Object} contestData - Contest data
 * @returns {Promise<Object>} - Created contest
 */
export const createContest = async (contestData) => {
  const response = await fetch(CONTESTS_BASE_URL, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(contestData),
  });
  return handleResponse(response);
};

/**
 * Get admin's contests
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} - List of contests
 */
export const getAdminContests = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.language) queryParams.append('language', filters.language);
  if (filters.difficulty_level) queryParams.append('difficulty_level', filters.difficulty_level);
  if (filters.contest_type) queryParams.append('contest_type', filters.contest_type);
  if (filters.is_published !== undefined) queryParams.append('is_published', filters.is_published);
  
  const url = queryParams.toString() 
    ? `${CONTESTS_BASE_URL}/admin?${queryParams.toString()}`
    : `${CONTESTS_BASE_URL}/admin`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Update contest
 * @param {number} contestId - Contest ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated contest
 */
export const updateContest = async (contestId, updates) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/${contestId}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

/**
 * Delete contest
 * @param {number} contestId - Contest ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteContest = async (contestId) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/${contestId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Get contest statistics
 * @param {number} contestId - Contest ID
 * @returns {Promise<Object>} - Contest statistics
 */
export const getContestStats = async (contestId) => {
  const response = await fetch(`${CONTESTS_BASE_URL}/${contestId}/stats`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};
