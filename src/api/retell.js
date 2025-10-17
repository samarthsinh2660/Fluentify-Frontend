import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Create a Retell AI call and get access token
 * @param {string} agentId - Retell agent ID
 * @returns {Promise<{success: boolean, data: {accessToken: string, callId: string}}>}
 */
export const createRetellCall = async (agentId) => {
  const response = await fetch(`${API_BASE_URL}/api/retell/create-call`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ agentId }),
  });
  
  return handleResponse(response);
};
