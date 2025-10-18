/**
 * Custom Hook for Chatbot Management
 * Manages chat sessions and messages
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatbotAPI from '../api/chatbot';

/**
 * Hook to manage chat sessions
 */
export const useChatSessions = (activeOnly = false) => {
  return useQuery({
    queryKey: ['chatSessions', activeOnly],
    queryFn: () => chatbotAPI.getChatSessions(activeOnly),
  });
};

/**
 * Hook to manage chat history for a specific session
 */
export const useChatHistory = (sessionId, options = {}) => {
  return useQuery({
    queryKey: ['chatHistory', sessionId, options],
    queryFn: () => chatbotAPI.getChatHistory(sessionId, options),
    enabled: !!sessionId,
  });
};

/**
 * Hook to create a new chat session
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: chatbotAPI.createChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
};

/**
 * Hook to send a message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, message }) => chatbotAPI.sendMessage(sessionId, message),
    onSuccess: (data, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
};

/**
 * Hook to update session title
 */
export const useUpdateSessionTitle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, title }) => chatbotAPI.updateSessionTitle(sessionId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
};

/**
 * Hook to delete a session
 */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: chatbotAPI.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
};

/**
 * Hook to end a session
 */
export const useEndSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: chatbotAPI.endSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
};
