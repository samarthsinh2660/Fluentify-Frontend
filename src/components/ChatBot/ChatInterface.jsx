/**
 * Chat Interface Component
 * Main chat window for interacting with the AI chatbot
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, Loader2, Trash2, ChevronLeft,
  Plus, Clock, CheckCircle2, MoreVertical 
} from 'lucide-react';
import { useChatSessions, useChatHistory, useCreateSession, useSendMessage, useDeleteSession } from '../../hooks/useChatbot';
import { MarkdownText } from '../../utils/markdown.jsx';

const ChatInterface = ({ onClose }) => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [message, setMessage] = useState('');
  const [showSessions, setShowSessions] = useState(true);
  const [pendingMessage, setPendingMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch sessions and current chat history
  const { data: sessionsData, isLoading: sessionsLoading } = useChatSessions(true);
  const { data: historyData, isLoading: historyLoading } = useChatHistory(currentSessionId);
  const createSession = useCreateSession();
  const sendMessage = useSendMessage();
  const deleteSession = useDeleteSession();

  const sessions = sessionsData?.data || [];
  const messages = historyData?.data || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle creating new session
  const handleNewChat = async () => {
    try {
      const response = await createSession.mutateAsync({});
      setCurrentSessionId(response.data.session.id);
      setShowSessions(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentSessionId) return;

    const userMessage = message;
    setMessage('');
    setPendingMessage(userMessage); // Show user message immediately

    try {
      await sendMessage.mutateAsync({ 
        sessionId: currentSessionId, 
        message: userMessage 
      });
      setPendingMessage(null); // Clear pending once response arrives
    } catch (error) {
      console.error('Failed to send message:', error);
      setPendingMessage(null);
    }
  };

  // Handle selecting a session
  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowSessions(false);
  };

  // Handle deleting a session
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteSession.mutateAsync(sessionId);
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
          setShowSessions(true);
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!showSessions && currentSessionId && (
              <button
                onClick={() => setShowSessions(true)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <Bot className="w-6 h-6" />
            <h3 className="font-semibold">
              {showSessions ? 'Language Learning Assistant' : 'Chat'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Sessions List View */}
      {showSessions && (
        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={handleNewChat}
            disabled={createSession.isPending}
            className="w-full mb-4 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Start New Chat
          </button>

          {sessionsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No chat sessions yet</p>
              <p className="text-sm">Start a new chat to begin!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{session.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(session.lastMessageAt || session.startedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{session.messageCount} messages</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat View */}
      {!showSessions && currentSessionId && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {historyLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bot className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Start a conversation!</p>
                <p className="text-sm">Ask me anything about language learning</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'learner' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${msg.sender === 'learner' ? 'bg-blue-500' : 'bg-purple-500'}
                  `}>
                    {msg.sender === 'learner' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`
                    max-w-[75%] p-3 rounded-lg
                    ${msg.sender === 'learner' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                    }
                  `}>
                    {msg.sender === 'learner' ? (
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    ) : (
                      <MarkdownText className="text-sm">{msg.message}</MarkdownText>
                    )}
                  </div>
                </div>
              ))
            )}
            {pendingMessage && (
              <div className="flex gap-2 flex-row-reverse">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-[75%] p-3 rounded-lg bg-blue-500 text-white">
                  <p className="text-sm whitespace-pre-wrap">{pendingMessage}</p>
                </div>
              </div>
            )}
            {sendMessage.isPending && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                maxLength={2000}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sendMessage.isPending}
              />
              <button
                type="submit"
                disabled={!message.trim() || sendMessage.isPending}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/2000 characters
            </p>
          </form>
        </>
      )}

      {/* No Session Selected */}
      {!showSessions && !currentSessionId && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No chat selected</p>
            <button
              onClick={() => setShowSessions(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Chats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
