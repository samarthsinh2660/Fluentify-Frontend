import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recommendationsAPI from '../api/recommendations';

/**
 * Fetch A* recommendations for a course.
 * Stale after 2 minutes — recommendations can change as mastery updates.
 */
export const useRecommendations = (courseId) => {
  return useQuery({
    queryKey: ['recommendations', courseId],
    queryFn: () => recommendationsAPI.fetchRecommendations(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Fetch mastery profile breakdown by concept type.
 */
export const useMasteryProfile = (courseId) => {
  return useQuery({
    queryKey: ['mastery-profile', courseId],
    queryFn: () => recommendationsAPI.fetchMasteryProfile(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Fetch full knowledge graph with mastery overlay and A* path.
 */
export const useKnowledgeGraph = (courseId) => {
  return useQuery({
    queryKey: ['knowledge-graph', courseId],
    queryFn: () => recommendationsAPI.fetchKnowledgeGraph(courseId),
    enabled: !!courseId,
    staleTime: 60 * 1000,
  });
};

/**
 * Admin: fetch a specific learner's knowledge graph.
 */
export const useLearnerKnowledgeGraph = (courseId, learnerId) => {
  return useQuery({
    queryKey: ['learner-knowledge-graph', courseId, learnerId],
    queryFn: () => recommendationsAPI.fetchLearnerKnowledgeGraph(courseId, learnerId),
    enabled: !!courseId && !!learnerId,
    staleTime: 60 * 1000,
  });
};

/**
 * Force-rebuild the concept graph for a course (deletes old nodes/edges, re-extracts with Gemini).
 */
export const useRebuildGraph = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => recommendationsAPI.rebuildConceptGraph(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-graph', courseId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations', courseId] });
    },
  });
};

/**
 * Mark a recommendation as followed and invalidate cached data.
 */
export const useMarkFollowed = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recommendationId) =>
      recommendationsAPI.markRecommendationFollowed(courseId, recommendationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations', courseId] });
    },
  });
};
