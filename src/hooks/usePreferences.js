import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLearnerPreferences, saveLearnerPreferences } from '../api/preferences';

/**
 * Hook to fetch learner preferences
 */
export const useLearnerPreferences = () => {
  return useQuery({
    queryKey: ['preferences', 'learner'],
    queryFn: getLearnerPreferences,
    retry: false,
  });
};

/**
 * Hook to save learner preferences
 */
export const useSaveLearnerPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveLearnerPreferences,
    onSuccess: () => {
      // Invalidate preferences query to refetch
      queryClient.invalidateQueries({ queryKey: ['preferences', 'learner'] });
    },
  });
};
