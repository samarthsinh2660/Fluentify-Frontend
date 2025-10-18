/**
 * ChatBot Wrapper Component
 * Manages the floating chat button and interface
 */

import React, { useState } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatInterface from './ChatInterface';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingChatButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />
      {isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatBot;
