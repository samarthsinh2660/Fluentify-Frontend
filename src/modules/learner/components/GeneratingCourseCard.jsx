import React from 'react';
import { Loader, BookOpen } from 'lucide-react';

/**
 * Generating Course Card Component
 * Shows real-time progress of course generation
 */
const GeneratingCourseCard = ({ state, onClick }) => {
  const { language, progress, units, totalUnits } = state;
  const generatedUnits = units.filter(u => u !== null).length;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border-2 border-blue-400 overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
    >
      {/* Generating Badge */}
      <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse">
        <Loader className="w-3 h-3 animate-spin" />
        Generating
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language} Course
            </h3>
            <p className="text-sm text-gray-600">
              Creating your personalized learning path...
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-blue-600">{progress}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
              style={{ width: `${(generatedUnits / totalUnits) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{generatedUnits}</div>
            <div className="text-xs text-gray-500">Generated</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {totalUnits - generatedUnits}
            </div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-400">{totalUnits}</div>
            <div className="text-xs text-gray-500">Total Units</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3">
        <div className="text-sm text-blue-700 font-medium">
          {generatedUnits > 0 ? (
            <span>✨ Click to view generated units</span>
          ) : (
            <span>⏳ Preparing your first unit...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratingCourseCard;
