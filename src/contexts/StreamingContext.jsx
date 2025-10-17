import React, { createContext, useContext } from 'react';
import { useStreamCourseGeneration } from '../hooks/useStreamCourseGeneration';

const StreamingContext = createContext(null);

export const StreamingProvider = ({ children }) => {
  const streamGeneration = useStreamCourseGeneration();

  return (
    <StreamingContext.Provider value={streamGeneration}>
      {children}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (!context) {
    throw new Error('useStreaming must be used within a StreamingProvider');
  }
  return context;
};
