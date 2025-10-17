import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, X, Volume2, Loader } from 'lucide-react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { createRetellCall } from '../api/retell';

const VoiceAIModal = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState('');
  
  const retellClientRef = useRef(null);

  // Initialize Retell client
  useEffect(() => {
    if (!isOpen) return;

    const retellClient = new RetellWebClient();
    retellClientRef.current = retellClient;

    // Set up event listeners
    retellClient.on('call_started', () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    retellClient.on('agent_start_talking', () => {
      setIsAgentSpeaking(true);
    });

    retellClient.on('agent_stop_talking', () => {
      setIsAgentSpeaking(false);
    });

    retellClient.on('call_ended', () => {
      setIsConnected(false);
      setIsAgentSpeaking(false);
    });

    retellClient.on('error', (error) => {
      setError('Connection error. Please try again.');
      setIsConnecting(false);
      setIsConnected(false);
    });

    retellClient.on('update', (update) => {
    });

    return () => {
      // Cleanup on unmount
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, [isOpen]);

  // Start conversation
  const startCall = async () => {
    if (!retellClientRef.current) return;

    setIsConnecting(true);
    setError('');

    try {
      // Get agent ID from environment
      const agentId = import.meta.env.VITE_RETELL_AGENT_ID;
      
      // Step 1: Get access token from backend
      const response = await createRetellCall(agentId);
      
      if (!response.success || !response.data.accessToken) {
        throw new Error('Failed to get access token');
      }
      
      const { accessToken } = response.data;
      
      // Step 2: Start call with access token
      await retellClientRef.current.startCall({
        accessToken: accessToken,
        sampleRate: 24000,
      });
      
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err.message || 'Failed to connect. Please try again.');
      setIsConnecting(false);
    }
  };

  // End conversation
  const endCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
    setIsConnected(false);
    setIsAgentSpeaking(false);
    onClose();
  };

  // Toggle mute
  const toggleMute = () => {
    if (retellClientRef.current) {
      if (isMuted) {
        // Unmute the microphone
        retellClientRef.current.unmute();
        setIsMuted(false);
      } else {
        // Mute the microphone
        retellClientRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Language Tutor</h2>
          <p className="text-sm text-gray-600">
            {isConnected ? 'Connected - Start speaking!' : 'Connect to start your conversation'}
          </p>
        </div>

        {/* Visual Indicator */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer pulsing ring when AI is speaking */}
            {isAgentSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-pulse" style={{ animationDelay: '150ms' }} />
              </>
            )}
            
            {/* Main circle */}
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? isAgentSpeaking 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-300' 
                  : 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-300'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}>
              {isConnecting ? (
                <Loader className="w-12 h-12 text-white animate-spin" />
              ) : isAgentSpeaking ? (
                <Volume2 className="w-12 h-12 text-white animate-pulse" />
              ) : isConnected ? (
                <Mic className="w-12 h-12 text-white" />
              ) : (
                <Phone className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-6">
          {isConnecting && (
            <p className="text-sm text-gray-600 animate-pulse">Connecting to AI tutor...</p>
          )}
          {isConnected && !isAgentSpeaking && (
            <p className="text-sm text-green-600 font-medium">🎙️ Listening...</p>
          )}
          {isAgentSpeaking && (
            <p className="text-sm text-blue-600 font-medium animate-pulse">🗣️ AI is speaking...</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={startCall}
              disabled={isConnecting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {isConnecting ? 'Connecting...' : 'Start Call'}
            </button>
          ) : (
            <>
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all shadow-lg ${
                  isMuted 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Phone className="w-5 h-5 rotate-135" />
                End Call
              </button>
            </>
          )}
        </div>

        {/* Info Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            💡 Practice speaking naturally. The AI tutor will help you improve your language skills!
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAIModal;
