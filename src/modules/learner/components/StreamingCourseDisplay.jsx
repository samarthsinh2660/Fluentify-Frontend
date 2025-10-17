import React from 'react';
import { CheckCircle, Loader, Clock } from 'lucide-react';
import { Button } from '../../../components';

/**
 * Streaming Course Display Component
 * Shows units as they are generated in real-time
 */
const StreamingCourseDisplay = ({ state, onClose, onNavigateToCourse }) => {
  const { courseId, language, totalUnits, units, currentGenerating, progress, isComplete, error } = state;

  const getUnitStatus = (index) => {
    const unitNumber = index + 1;
    const unit = units[index];
    const isGenerating = currentGenerating === unitNumber;
    const isGenerated = unit !== null;
    const isPending = !isGenerated && !isGenerating;

    return { unit, isGenerating, isGenerated, isPending, unitNumber };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {isComplete ? '🎉 Course Generated!' : '⚡ Generating Your Course...'}
              </h2>
              <p className="text-emerald-100">
                {language} Course • Progress: {progress}
              </p>
            </div>
            {isComplete && (
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!isComplete && (
          <div className="px-6 pt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${(units.filter(u => u !== null).length / totalUnits) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Units Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((_, index) => {
            const { unit, isGenerating, isGenerated, isPending, unitNumber } = getUnitStatus(index);

            return (
              <div
                key={index}
                className={`
                  relative border-2 rounded-xl p-5 transition-all duration-300
                  ${isGenerated ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md' : ''}
                  ${isGenerating ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg animate-pulse' : ''}
                  ${isPending ? 'border-gray-200 bg-gray-50 opacity-60' : ''}
                `}
              >
                {/* Unit Number Badge */}
                <div className={`
                  absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md
                  ${isGenerated ? 'bg-emerald-500 text-white' : ''}
                  ${isGenerating ? 'bg-blue-500 text-white' : ''}
                  ${isPending ? 'bg-gray-300 text-gray-600' : ''}
                `}>
                  {unitNumber}
                </div>

                {/* Generated Unit */}
                {isGenerated && unit && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {unit.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {unit.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        📚 {unit.lessons?.length || 0} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {unit.estimatedTime || 0} min
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {unit.difficulty}
                      </span>
                    </div>
                  </div>
                )}

                {/* Generating Unit */}
                {isGenerating && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                      <h3 className="font-bold text-gray-900">
                        Unit {unitNumber}
                      </h3>
                    </div>
                    <p className="text-sm text-blue-600">
                      Generating content...
                    </p>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}

                {/* Pending Unit */}
                {isPending && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <h3 className="font-bold text-gray-500">
                        Unit {unitNumber}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Waiting to generate...
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {isComplete && (
          <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  All {totalUnits} units are ready! Start learning now.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="ghost"
                >
                  Close
                </Button>
                <Button
                  onClick={() => onNavigateToCourse(courseId)}
                  variant="success"
                >
                  View Course →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamingCourseDisplay;
