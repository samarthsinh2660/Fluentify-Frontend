import React from 'react';

/**
 * Base Skeleton Component
 * Reusable animated skeleton loader
 */
export const Skeleton = ({ className = '', width, height, circle = false }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
  const shapeClasses = circle ? 'rounded-full' : 'rounded';
  
  const style = {
    width: width || '100%',
    height: height || '1rem',
    animation: 'shimmer 1.5s infinite',
  };

  return (
    <div 
      className={`${baseClasses} ${shapeClasses} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton Text - For loading text content
 */
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="0.75rem"
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton Card - For loading card layouts
 */
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header with icon */}
        <div className="flex items-center gap-3">
          <Skeleton circle width="3rem" height="3rem" />
          <div className="flex-1 space-y-2">
            <Skeleton height="1.25rem" width="60%" />
            <Skeleton height="0.875rem" width="40%" />
          </div>
        </div>
        
        {/* Content */}
        <SkeletonText lines={3} />
        
        {/* Footer with stats */}
        <div className="flex gap-4 pt-2">
          <Skeleton height="1rem" width="5rem" />
          <Skeleton height="1rem" width="5rem" />
          <Skeleton height="1rem" width="5rem" />
        </div>
        
        {/* Button */}
        <Skeleton height="2.5rem" width="100%" className="rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Skeleton Course Card - Specific for course cards
 */
export const SkeletonCourseCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton height="1.5rem" width="70%" />
            <Skeleton height="1rem" width="40%" className="mt-2" />
          </div>
          <Skeleton circle width="3rem" height="3rem" />
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton height="0.875rem" width="4rem" />
            <Skeleton height="0.875rem" width="3rem" />
          </div>
          <Skeleton height="0.5rem" width="100%" className="rounded-full" />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="0.75rem" width="60%" />
          </div>
          <div className="space-y-2">
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="0.75rem" width="60%" />
          </div>
          <div className="space-y-2">
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="0.75rem" width="60%" />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-4">
        <Skeleton height="2.5rem" width="100%" className="rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Skeleton Unit Card - For course page units
 */
export const SkeletonUnitCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton circle width="2.5rem" height="2.5rem" />
            <div className="flex-1 space-y-2">
              <Skeleton height="1.25rem" width="50%" />
              <Skeleton height="0.875rem" width="30%" />
            </div>
          </div>
          <Skeleton width="2rem" height="2rem" />
        </div>
        
        {/* Lessons */}
        <div className="space-y-3 pl-11">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton circle width="1.5rem" height="1.5rem" />
              <div className="flex-1 space-y-1">
                <Skeleton height="1rem" width="60%" />
                <Skeleton height="0.75rem" width="40%" />
              </div>
              <Skeleton width="4rem" height="1.5rem" className="rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Page Header
 */
export const SkeletonPageHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Skeleton width="2rem" height="2rem" />
            <div className="space-y-2 flex-1 max-w-md">
              <Skeleton height="2rem" width="60%" />
              <Skeleton height="1rem" width="40%" />
            </div>
          </div>
          <Skeleton width="8rem" height="2.5rem" className="rounded-lg" />
        </div>
      </div>
    </header>
  );
};

export default Skeleton;
