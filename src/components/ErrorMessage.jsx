import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error Message Component
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onDismiss - Optional dismiss handler
 */
const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-600 dark:text-red-200 text-sm flex items-start gap-2">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-700 dark:text-red-200 dark:hover:text-red-100 ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
