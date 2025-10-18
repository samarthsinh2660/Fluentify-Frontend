/**
 * Floating Chat Button Component
 * Bottom-right floating button to open chatbot
 */

import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const FloatingChatButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        ${isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }
      `}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <MessageCircle className="w-6 h-6 text-white" />
      )}
      
      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      )}
    </button>
  );
};

export default FloatingChatButton;
