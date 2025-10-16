import React from 'react';
import { Target, Flame, CheckCircle } from 'lucide-react';

/**
 * Course Card Component
 * @param {Object} props
 * @param {Object} props.course - Course object
 * @param {Function} props.onClick - Click handler
 */
const CourseCard = ({ course, onClick }) => {
  const progress = course.progress || {};
  const progressPercentage = progress.progressPercentage || 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
          <p className="text-sm text-gray-600">{course.language}</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>{progress.currentStreak || 0} day streak</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{progress.unitsCompleted || 0} units done</span>
        </div>
      </div>
      
      <button
        onClick={() => onClick(course)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
      </button>
    </div>
  );
};

export default CourseCard;
