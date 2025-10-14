import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LearnerPreferences from './pages/LearnerPreferences';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import { getLearnerPreferences } from './routes/preferences';
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

function PreferencesRoute() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkUserStatus = async () => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
      
        if (payload.hasPreferences) {
          const isFromForm = location.state?.fromForm;
          
          if (!isFromForm) {
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        localStorage.removeItem('jwt');
        navigate('/login', { replace: true });
      }
    };

    checkUserStatus();

    return () => {
      mounted = false;
    };
  }, [token, navigate, location]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <LearnerPreferences />;
}

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/preferences" element={
        <ProtectedRoute role="learner">
          <PreferencesRoute />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute role="learner">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/course/:courseId" element={
        <ProtectedRoute role="learner">
          <CoursePage />
        </ProtectedRoute>
      } />
      <Route path="/lesson/:courseId/:lessonId" element={
        <ProtectedRoute role="learner">
          <LessonPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
