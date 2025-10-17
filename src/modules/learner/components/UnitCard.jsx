import React from 'react';
import { CheckCircle, Play, Lock, Loader } from 'lucide-react';
import LessonCard from './LessonCard';

/**
 * Unit Card Component
 * @param {Object} props
 * @param {Object} props.unit - Unit object
 * @param {number} props.unitIndex - Unit index
 * @param {Function} props.onLessonClick - Lesson click handler
 * @param {Function} props.onUnitClick - Unit click handler (for locked units)
 */
const UnitCard = ({ unit, unitIndex, onLessonClick, onUnitClick }) => {
  const isGenerating = unit.isGenerating || false;
  const borderColor = isGenerating ? 'border-blue-400' : 'border-gray-200';
  const opacity = !unit.isUnlocked && !isGenerating ? 'opacity-60' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border-2 ${borderColor} ${opacity} ${isGenerating ? 'animate-pulse' : ''}`}
      onClick={() => !unit.isUnlocked && !isGenerating && onUnitClick(unit)}
    >
      {/* Unit Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isGenerating ? (
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              ) : unit.isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : unit.isUnlocked ? (
                <Play className="w-5 h-5 text-blue-600" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="text-lg font-semibold">{unit.title}</h3>
              {isGenerating && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                  <Loader className="w-3 h-3 animate-spin" />
                  Generating...
                </span>
              )}
              {!unit.isUnlocked && !isGenerating && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  💤 Waiting
                </span>
              )}
              {unit.isCompleted && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  ✅ Completed
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {unit.lessons ? unit.lessons.filter(l => l.isCompleted).length : 0}
              /
              {unit.lessons ? unit.lessons.length : 0} lessons
            </span>
          </div>
        </div>
      </div>
      
      {/* Lessons Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unit.lessons && unit.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lessonIndex={index}
              onClick={() => onLessonClick(lesson, unit.id, unitIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitCard;
