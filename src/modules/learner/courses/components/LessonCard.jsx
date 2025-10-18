import React from 'react';
import { CheckCircle, Play, Lock } from 'lucide-react';

/**
 * Lesson Card Component
 * @param {Object} props
 * @param {Object} props.lesson - Lesson object
 * @param {number} props.lessonIndex - Lesson index
 * @param {Function} props.onClick - Click handler
 */
const LessonCard = ({ lesson, lessonIndex, onClick }) => {
  const getCardStyles = () => {
    if (!lesson.isUnlocked) {
      return 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60';
    }
    if (lesson.isCompleted) {
      return 'border-green-200 bg-green-50 cursor-pointer hover:shadow-md';
    }
    return 'border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md';
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 transition-all ${getCardStyles()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Lesson Header */}
          <div className="flex items-center gap-2 mb-2">
            {lesson.isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : lesson.isUnlocked ? (
              <Play className="w-5 h-5 text-blue-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
            <h4 className="font-medium">{lesson.title}</h4>
            <span className="text-xs text-gray-400">#{lessonIndex + 1}</span>
          </div>
          
          {/* Lesson Description */}
          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
          
          {/* Completion Info */}
          {lesson.isCompleted && (
            <div className="flex items-center gap-3 text-xs text-green-700 mb-2">
              <span className="bg-green-100 px-2 py-1 rounded">
                Score: {lesson.score}%
              </span>
              <span className="bg-green-100 px-2 py-1 rounded">
                XP: +{lesson.xpEarned}
              </span>
            </div>
          )}
          
          {/* Lesson Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>⏱️ {lesson.estimatedDuration || 0} min</span>
            <span>🎯 {lesson.xpReward || 0} XP</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="ml-2">
          {lesson.isCompleted ? (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded font-medium whitespace-nowrap">
              ✅ Completed
            </span>
          ) : !lesson.isUnlocked ? (
            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded font-medium whitespace-nowrap">
              🔒 Locked
            </span>
          ) : (
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-medium whitespace-nowrap">
              Start →
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
