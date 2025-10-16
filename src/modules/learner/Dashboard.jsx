import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';
import { useCourses, useGenerateCourse } from '../../hooks/useCourses';
import { useLogout } from '../../hooks/useAuth';
import { Button, LoadingSpinner } from '../../components';
import { CourseCard, CourseGenerationForm } from './components';

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  
  // React Query hooks
  const { data: courses = [], isLoading: loading } = useCourses();
  const generateMutation = useGenerateCourse();
  
  // Local state
  const [error, setError] = useState('');
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateForm, setGenerateForm] = useState({ language: '', expectedDuration: '' });


  const handleLogout = () => {
    logout();
  };

  // Generate a new course
  const generateCourse = () => {
    if (!generateForm.language || !generateForm.expectedDuration) {
      setError('Please select both language and duration');
      return;
    }

    setError('');
    
    generateMutation.mutate(
      {
        language: generateForm.language,
        expectedDuration: generateForm.expectedDuration
      },
      {
        onSuccess: () => {
          setShowGenerateForm(false);
          setGenerateForm({ language: '', expectedDuration: '' });
        },
        onError: (err) => {
          setError(err.message || 'Failed to generate course');
        }
      }
    );
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
            <Button
              onClick={() => setShowGenerateForm(true)}
              loading={generateMutation.isPending}
              icon={<BookOpen className="w-4 h-4" />}
            >
              Generate New Course
            </Button>
          </div>

          {showGenerateForm && (
            <CourseGenerationForm
              form={generateForm}
              setForm={setGenerateForm}
              onGenerate={generateCourse}
              onCancel={() => {
                setShowGenerateForm(false);
                setGenerateForm({ language: '', expectedDuration: '' });
                setError('');
              }}
              isGenerating={generateMutation.isPending}
              error={error}
            />
          )}

          {loading ? (
            <LoadingSpinner text="Loading courses..." />
          ) : courses.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses yet. Generate your first course to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default Dashboard;
