import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, MessageCircle } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import { useLogout } from '../../hooks/useAuth';
import { useStreaming } from '../../contexts/StreamingContext';
import { Button, SkeletonCourseCard, VoiceAIModal } from '../../components';
import { CourseCard, CourseGenerationForm, GeneratingCourseCard } from './components';

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  
  // React Query hooks
  const { data: courses = [], isLoading: loading } = useCourses();
  
  // Streaming course generation hook
  const { generateCourse: startStreamGeneration, state: streamState, reset: resetStream } = useStreaming();
  
  // Local state
  const [error, setError] = useState('');
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateForm, setGenerateForm] = useState({ language: '', expectedDuration: '', expertise: '' });
  const [showVoiceAI, setShowVoiceAI] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Generate a new course using SSE
  const generateCourse = () => {
    if (!generateForm.language || !generateForm.expectedDuration || !generateForm.expertise) {
      setError('Please select language, duration, and current level');
      return;
    }

    setError('');
    setShowGenerateForm(false);
    
    // Start streaming course generation
    startStreamGeneration({
      language: generateForm.language,
      expectedDuration: generateForm.expectedDuration,
      expertise: generateForm.expertise
    });
  };

  const handleCloseStream = () => {
    resetStream();
    setGenerateForm({ language: '', expectedDuration: '', expertise: '' });
  };

  const handleNavigateToCourse = (courseId) => {
    resetStream();
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header with Logout Button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Fluentify</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600">Start your language learning journey today!</p>
        </div>

        {/* Course Generation Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Courses</h3>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowVoiceAI(true)}
                variant="outline"
                icon={<MessageCircle className="w-4 h-4" />}
              >
                Talk with AI
              </Button>
              <Button
                onClick={() => setShowGenerateForm(true)}
                loading={streamState.isGenerating}
                disabled={streamState.isGenerating}
                icon={<BookOpen className="w-4 h-4" />}
              >
                Generate New Course
              </Button>
            </div>
          </div>

          {showGenerateForm && (
            <CourseGenerationForm
              form={generateForm}
              setForm={setGenerateForm}
              onGenerate={generateCourse}
              onCancel={() => {
                setShowGenerateForm(false);
                setGenerateForm({ language: '', expectedDuration: '', expertise: '' });
                setError('');
              }}
              isGenerating={streamState.isGenerating}
              error={error}
            />
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCourseCard key={i} />
              ))}
            </div>
          ) : courses.length === 0 && !streamState.isGenerating ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses yet. Generate your first course to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Show generating course card first */}
              {streamState.isGenerating && streamState.courseId && (
                <GeneratingCourseCard
                  state={streamState}
                  onClick={() => navigate(`/course/${streamState.courseId}`)}
                />
              )}
              
              {/* Show existing courses */}
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={(course) => navigate(`/course/${course.id}`, { state: { progress: course.progress } })}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Voice AI Modal */}
      <VoiceAIModal 
        isOpen={showVoiceAI} 
        onClose={() => setShowVoiceAI(false)} 
      />
    </div>
  );
};

export default Dashboard;
