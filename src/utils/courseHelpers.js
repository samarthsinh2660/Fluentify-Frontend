/**
 * Calculate progress from units data
 * @param {Array} unitsData - Array of units with lessons
 * @returns {Object} Progress object with percentages and counts
 */
export const calculateProgress = (unitsData) => {
  let totalLessons = 0;
  let completedLessons = 0;
  let completedUnits = 0;

  unitsData.forEach(unit => {
    const unitLessons = unit.lessons || [];
    const unitTotal = unitLessons.length;
    const unitCompleted = unitLessons.filter(lesson => lesson.isCompleted).length;
    
    totalLessons += unitTotal;
    completedLessons += unitCompleted;
    
    if (unitTotal > 0 && unitCompleted === unitTotal) {
      completedUnits += 1;
    }
  });

  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100 * 10) / 10 
    : 0;

  return {
    progressPercentage,
    lessonsCompleted: completedLessons,
    unitsCompleted: completedUnits
  };
};

/**
 * Calculate total XP earned from completed lessons
 * @param {Array} unitsData - Array of units with lessons
 * @returns {number} Total XP earned
 */
export const calculateTotalXP = (unitsData) => {
  return unitsData.reduce((total, unit) => {
    return total + (unit.lessons || []).reduce((unitTotal, lesson) => {
      const xp = lesson.xpEarned || lesson.xp_earned || 0;
      return unitTotal + (lesson.isCompleted ? xp : 0);
    }, 0);
  }, 0);
};

/**
 * Check if lesson is unlocked based on previous lessons
 * @param {Object} lesson - Lesson object
 * @returns {boolean}
 */
export const isLessonUnlocked = (lesson) => {
  return lesson.isUnlocked === true;
};

/**
 * Check if unit is unlocked
 * @param {Object} unit - Unit object
 * @returns {boolean}
 */
export const isUnitUnlocked = (unit) => {
  return unit.isUnlocked === true;
};
