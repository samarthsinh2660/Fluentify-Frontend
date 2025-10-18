/**
 * Custom Hook for Contest Management
 * Manages contests for both learners and admins
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contestsAPI from '../api/contests';

// ============= LEARNER HOOKS =============

/**
 * Hook to browse published contests
 */
export const useBrowseContests = (language = null) => {
  return useQuery({
    queryKey: ['contests', language],
    queryFn: () => contestsAPI.browseContests(language),
  });
};

/**
 * Hook to get contest details
 */
export const useContestDetails = (contestId) => {
  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: () => contestsAPI.getContestDetails(contestId),
    enabled: !!contestId,
  });
};

/**
 * Hook to get contest leaderboard
 */
export const useContestLeaderboard = (contestId, limit = 100) => {
  return useQuery({
    queryKey: ['leaderboard', contestId, limit],
    queryFn: () => contestsAPI.getContestLeaderboard(contestId, limit),
    enabled: !!contestId,
  });
};

/**
 * Hook to get user's submission
 */
export const useMySubmission = (contestId) => {
  return useQuery({
    queryKey: ['mySubmission', contestId],
    queryFn: () => contestsAPI.getMySubmission(contestId),
    enabled: !!contestId,
  });
};

/**
 * Hook to submit contest answers
 */
export const useSubmitContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contestId, answers, timeTaken }) => 
      contestsAPI.submitContestAnswers(contestId, { answers, timeTaken }),
    onSuccess: (data, { contestId }) => {
      queryClient.invalidateQueries({ queryKey: ['mySubmission', contestId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', contestId] });
      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
    },
  });
};

// ============= ADMIN HOOKS =============

/**
 * Hook to get admin's contests
 */
export const useAdminContests = (filters = {}) => {
  return useQuery({
    queryKey: ['adminContests', filters],
    queryFn: () => contestsAPI.getAdminContests(filters),
  });
};

/**
 * Hook to generate contest with AI
 */
export const useGenerateContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contestsAPI.generateContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContests'] });
    },
  });
};

/**
 * Hook to create contest manually
 */
export const useCreateContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contestsAPI.createContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContests'] });
    },
  });
};

/**
 * Hook to update contest
 */
export const useUpdateContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contestId, updates }) => contestsAPI.updateContest(contestId, updates),
    onSuccess: (data, { contestId }) => {
      queryClient.invalidateQueries({ queryKey: ['adminContests'] });
      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
    },
  });
};

/**
 * Hook to delete contest
 */
export const useDeleteContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contestsAPI.deleteContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContests'] });
    },
  });
};

/**
 * Hook to get contest statistics
 */
export const useContestStats = (contestId) => {
  return useQuery({
    queryKey: ['contestStats', contestId],
    queryFn: () => contestsAPI.getContestStats(contestId),
    enabled: !!contestId,
  });
};
