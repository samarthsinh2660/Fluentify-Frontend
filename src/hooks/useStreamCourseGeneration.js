import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, getAuthHeader } from '../api/apiHelpers';

/**
 * Custom hook for streaming course generation using SSE
 * Uses fetch + ReadableStream to support Authorization headers
 * @returns {Object} - { generateCourse, state, reset }
 */
export const useStreamCourseGeneration = () => {
  const queryClient = useQueryClient();
  const [abortController, setAbortController] = useState(null);

  const [state, setState] = useState({
    isGenerating: false,
    courseId: null,
    language: '',
    totalUnits: 6,
    units: [], // Array to store generated units
    currentGenerating: null,
    progress: '0/6',
    isComplete: false,
    error: null,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const reset = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setState({
      isGenerating: false,
      courseId: null,
      language: '',
      totalUnits: 6,
      units: [],
      currentGenerating: null,
      progress: '0/6',
      isComplete: false,
      error: null,
    });
  }, [abortController]);

  const generateCourse = useCallback(async ({ language, expectedDuration, expertise }) => {
    // Close any existing connection
    if (abortController) {
      abortController.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    setAbortController(controller);

    // Reset state
    setState({
      isGenerating: true,
      courseId: null,
      language: language,
      totalUnits: 6,
      units: Array(6).fill(null), // Initialize with 6 empty slots
      currentGenerating: null,
      progress: '0/6',
      isComplete: false,
      error: null,
    });

    const params = new URLSearchParams({
      language: language,
      expectedDuration: expectedDuration,
      expertise: expertise,
    });

    // Build URL using API_BASE_URL
    const url = `${API_BASE_URL}/api/courses/generate-stream?${params.toString()}`;

    try {
      // Use fetch with headers instead of EventSource
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeader(), // Now we can use Authorization header!
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log('Stream ended');
              break;
            }

            // Decode the chunk
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            let currentEvent = null;
            let currentData = null;

            // Helper function to process SSE events (defined before use)
            const processSSEEvent = (eventType, data) => {
              if (eventType === 'course_created') {
                console.log('📚 Course created:', data);
                setState(prev => ({
                  ...prev,
                  courseId: data.courseId,
                  totalUnits: data.totalUnits,
                  units: Array(data.totalUnits).fill(null),
                }));
              }
              else if (eventType === 'unit_generating') {
                console.log('⏳ Generating unit:', data);
                setState(prev => ({
                  ...prev,
                  currentGenerating: data.unitNumber,
                }));
              }
              else if (eventType === 'unit_generated') {
                console.log('✅ Unit generated:', data);
                setState(prev => {
                  const newUnits = [...prev.units];
                  newUnits[data.unitNumber - 1] = data.unit;

                  return {
                    ...prev,
                    units: newUnits,
                    currentGenerating: null,
                    progress: data.progress || `${data.unitNumber}/${prev.totalUnits}`,
                  };
                });
              }
              else if (eventType === 'course_complete') {
                console.log('🎉 Course complete:', data);
                setState(prev => ({
                  ...prev,
                  isComplete: true,
                  isGenerating: false,
                  currentGenerating: null,
                  progress: `${prev.totalUnits}/${prev.totalUnits}`,
                }));

                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });

                controller.abort();
                setAbortController(null);
              }
              else if (eventType === 'error') {
                console.error('❌ SSE Error:', data);
                setState(prev => ({
                  ...prev,
                  error: data.message || 'Course generation failed',
                  isGenerating: false,
                  currentGenerating: null,
                }));
                controller.abort();
                setAbortController(null);
              }
            };

            for (const line of lines) {
              const trimmedLine = line.trim();

              if (trimmedLine.startsWith('event: ')) {
                currentEvent = trimmedLine.substring(7).trim();
              }
              else if (trimmedLine.startsWith('data: ')) {
                try {
                  currentData = JSON.parse(trimmedLine.substring(6).trim());
                } catch (parseError) {
                  console.error('Error parsing SSE data:', parseError, trimmedLine);
                  currentData = null;
                  continue;
                }
              }
              else if (trimmedLine === '') {
                // Empty line indicates end of SSE message
                if (currentEvent && currentData) {
                  console.log(`📡 SSE Event: ${currentEvent}`, currentData);

                  // Process the complete event
                  processSSEEvent(currentEvent, currentData);

                  // Reset for next message
                  currentEvent = null;
                  currentData = null;
                }
              }
            }

            // Remove duplicate processSSEEvent function
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Stream aborted');
          } else {
            console.error('Stream error:', error);
            setState(prev => ({
              ...prev,
              error: 'Connection lost. Please try again.',
              isGenerating: false,
              currentGenerating: null,
            }));
          }
        }
      };

      processStream();

    } catch (error) {
      console.error('Failed to start SSE stream:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to start course generation',
        isGenerating: false,
      }));
    }
  }, [abortController, queryClient]);

  return {
    generateCourse,
    state,
    reset,
  };
};
