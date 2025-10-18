import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from '../modules/auth';
import { 
  Dashboard, 
  CoursePage, 
  LessonPage,
  ContestsPage,
  ContestDetailPage,
  ContestLeaderboardPage
} from '../modules/learner';
import { 
  AdminDashboard,
  AdminContestsPage,
  GenerateContestPage,
  EditContestPage,
  ContestStatsPage
} from '../modules/admin';
import { StreamingProvider } from '../contexts/StreamingContext';
import { ChatBot } from '../components/ChatBot';
import './App.css';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('jwt');
  if (!token) return <Navigate to="/login" />;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (role && payload.role !== role) return <Navigate to="/login" />;
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwt');
      return <Navigate to="/login" />;
    }
    return children;
  } catch {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }
}

function App() {
  const token = localStorage.getItem('jwt');
  const isLearner = token ? (() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'learner';
    } catch {
      return false;
    }
  })() : false;

  return (
    <StreamingProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Learner Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="learner">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/course/:courseId" element={
          <ProtectedRoute role="learner">
            <CoursePage />
          </ProtectedRoute>
        } />
        <Route path="/lesson/:courseId/:unitId/:lessonId" element={
          <ProtectedRoute role="learner">
            <LessonPage />
          </ProtectedRoute>
        } />
        <Route path="/contests" element={
          <ProtectedRoute role="learner">
            <ContestsPage />
          </ProtectedRoute>
        } />
        <Route path="/contests/:contestId" element={
          <ProtectedRoute role="learner">
            <ContestDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/contests/:contestId/leaderboard" element={
          <ProtectedRoute role="learner">
            <ContestLeaderboardPage />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-contests" element={
          <ProtectedRoute role="admin">
            <AdminContestsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-contests/generate" element={
          <ProtectedRoute role="admin">
            <GenerateContestPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-contests/:contestId/edit" element={
          <ProtectedRoute role="admin">
            <EditContestPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-contests/:contestId/stats" element={
          <ProtectedRoute role="admin">
            <ContestStatsPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      
      {/* Chatbot - Only show for learners */}
      {isLearner && <ChatBot />}
    </StreamingProvider>
  );
}

export default App;
