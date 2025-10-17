import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Fetch all courses for the learner
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Generate a new course
 * @param {Object} courseData
 * @param {string} courseData.language - Language to learn
 * @param {string} courseData.expectedDuration - Expected duration
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const generateCourse = async ({ language, expectedDuration }) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/generate`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ language, expectedDuration }),
  });
  
  return handleResponse(response);
};

/**
 * Fetch course details with units and lessons
 * @param {number} courseId - Course ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchCourseDetails = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Fetch lesson details
 * @param {number} courseId - Course ID
 * @param {number} unitId - Unit ID
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchLessonDetails = async ({ courseId, unitId, lessonId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/units/${unitId}/lessons/${lessonId}`,
    {
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};

/**
 * Generate additional exercises for a lesson
 * @param {number} courseId - Course ID
 * @param {number} unitId - Unit ID
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const generateExercises = async ({ courseId, unitId, lessonId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/units/${unitId}/lessons/${lessonId}/exercises`,
    {
      method: 'POST',
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};

/**
 * Mark lesson as complete
 * @param {number} courseId - Course ID
 * @param {number} unitId - Unit ID
 * @param {number} lessonId - Lesson ID
 * @param {Object} progressData - Progress data (score, exercises)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const completeLesson = async ({ courseId, unitId, lessonId, score = 100, exercises = [] }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/progress/courses/${courseId}/units/${unitId}/lessons/${lessonId}/complete`,
    {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ score, exercises }),
    }
  );
  
  return handleResponse(response);
};

/**
 * Delete a course
 * @param {number} courseId - Course ID to delete
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};
