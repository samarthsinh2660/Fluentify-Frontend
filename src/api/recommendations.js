import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Fetch A* recommendations for a course.
 * @param {number} courseId
 */
export const fetchRecommendations = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/recommendations/${courseId}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Fetch learner concept mastery profile for a course.
 * @param {number} courseId
 */
export const fetchMasteryProfile = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/recommendations/${courseId}/mastery`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Fetch full knowledge graph (nodes + edges + A* path overlay).
 * @param {number} courseId
 */
export const fetchKnowledgeGraph = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/recommendations/${courseId}/graph`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Admin: fetch a learner's knowledge graph for a course.
 * @param {number} courseId
 * @param {number} learnerId
 */
export const fetchLearnerKnowledgeGraph = async (courseId, learnerId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/recommendations/${courseId}/graph?learnerId=${learnerId}`,
    { headers: getAuthHeader() }
  );
  return handleResponse(response);
};

/**
 * Force-rebuild concept graph for a course (delete old nodes/edges, re-extract with Gemini).
 * @param {number} courseId
 */
export const rebuildConceptGraph = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/recommendations/${courseId}/rebuild-graph`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Mark a recommendation as followed.
 * @param {number} courseId
 * @param {number} recommendationId
 */
export const markRecommendationFollowed = async (courseId, recommendationId) => {
  const response = await fetch(`${API_BASE_URL}/api/recommendations/${courseId}/follow`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ recommendationId }),
  });
  return handleResponse(response);
};
