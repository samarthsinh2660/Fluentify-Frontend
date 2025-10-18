/**
 * Application Constants
 * Centralized location for app-wide constant values
 */

// Language options for course generation
export const LANGUAGES = [
  { code: "ES", name: "Spanish" },
  { code: "FR", name: "French" },
  { code: "JP", name: "Japanese" },
  { code: "DE", name: "German" },
  { code: "IT", name: "Italian" },
  { code: "IN", name: "Hindi" },
];

// Duration options for course generation
export const DURATIONS = [
  "1 month",
  "3 months",
  "6 months",
  "1 year",
  "More than 1 year",
];

// Expertise levels for learner preferences
export const EXPERTISE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// User roles
export const USER_ROLES = {
  LEARNER: 'learner',
  ADMIN: 'admin',
};

// Contest types
export const CONTEST_TYPES = [
  { value: 'mcq', label: 'Multiple Choice Questions' },
  { value: 'one-liner', label: 'One-Liner Answers' },
  { value: 'mix', label: 'Mixed (MCQ + One-Liner)' },
];

// Contest status
export const CONTEST_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  ENDED: 'ended',
};
