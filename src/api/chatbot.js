/**
 * Chatbot API Module
 * Handles all chatbot-related API calls
 */

import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

const CHAT_BASE_URL = `${API_BASE_URL}/api/chat`;

/**
 * Create a new chat session
 * @param {Object} params - Session parameters
 * @param {string} params.language - Language for the chat (optional)
 * @param {string} params.title - Session title (optional)
 * @returns {Promise<Object>} - Created session data
 */
export const createChatSession = async ({ language, title } = {}) => {
  const response = await fetch(`${CHAT_BASE_URL}/sessions`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ language, title }),
  });
  return handleResponse(response);
};

/**
 * Get all chat sessions
 * @param {boolean} activeOnly - Filter for active sessions only
 * @returns {Promise<Object>} - List of sessions
 */
export const getChatSessions = async (activeOnly = false) => {
  const url = activeOnly 
    ? `${CHAT_BASE_URL}/sessions?active_only=true`
    : `${CHAT_BASE_URL}/sessions`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Send a message and get AI response
 * @param {number} sessionId - Session ID
 * @param {string} message - User message
 * @returns {Promise<Object>} - User and AI messages
 */
export const sendMessage = async (sessionId, message) => {
  const response = await fetch(`${CHAT_BASE_URL}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ message }),
  });
  return handleResponse(response);
};

/**
 * Get chat history for a session
 * @param {number} sessionId - Session ID
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Messages per page
 * @param {number} params.offset - Offset for pagination
 * @returns {Promise<Object>} - Chat messages
 */
export const getChatHistory = async (sessionId, { limit = 100, offset = 0 } = {}) => {
  const response = await fetch(
    `${CHAT_BASE_URL}/sessions/${sessionId}/messages?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};

/**
 * Update session title
 * @param {number} sessionId - Session ID
 * @param {string} title - New title
 * @returns {Promise<Object>} - Updated session
 */
export const updateSessionTitle = async (sessionId, title) => {
  const response = await fetch(`${CHAT_BASE_URL}/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify({ title }),
  });
  return handleResponse(response);
};

/**
 * Delete a chat session
 * @param {number} sessionId - Session ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteSession = async (sessionId) => {
  const response = await fetch(`${CHAT_BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Delete all chat sessions
 * @returns {Promise<Object>} - Success message
 */
export const deleteAllSessions = async () => {
  const response = await fetch(`${CHAT_BASE_URL}/sessions`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * End a chat session
 * @param {number} sessionId - Session ID
 * @returns {Promise<Object>} - Success message
 */
export const endSession = async (sessionId) => {
  const response = await fetch(`${CHAT_BASE_URL}/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};
