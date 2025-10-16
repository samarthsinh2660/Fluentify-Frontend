import React from 'react';

/**
 * Loading Spinner Component
 * @param {Object} props
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {string} props.text - Loading text
 * @param {boolean} props.fullScreen - Full screen loading
 */
const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg 
        className={`animate-spin ${sizeClasses[size]} text-blue-600`}
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4" 
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

export default LoadingSpinner;
