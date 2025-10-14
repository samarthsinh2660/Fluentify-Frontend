import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Target, Clock, CheckCircle, Lock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateForm, setGenerateForm] = useState({ language: '', expectedDuration: '' });

  const languages = [
    { code: "ES", name: "Spanish" },
    { code: "FR", name: "French" },
    { code: "JP", name: "Japanese" },
    { code: "DE", name: "German" },
    { code: "IT", name: "Italian" },
    { code: "IN", name: "Hindi" },
  ];

  const durations = [
    "1 month",
    "3 months",
    "6 months",
    "1 year",
    "More than 1 year",
  ];

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  // Check if user has preferences and return them
  const getUserPreferences = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:5000/api/preferences/learner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.status === 200 && data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Error checking preferences:', error);
      return null;
    }
  };

  // Generate a new course
  const generateCourse = async () => {
    if (!generateForm.language || !generateForm.expectedDuration) {
      setError('Please select both language and duration');
      return;
    }

    setGenerating(true);
    setError('');
    
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:5000/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: generateForm.language,
          expectedDuration: generateForm.expectedDuration
        })
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.success) {
          setCourses(prev => [data.data, ...prev]);
          setShowGenerateForm(false);
          setGenerateForm({ language: '', expectedDuration: '' });
        } else {
          setError(data.error?.message || data.message || 'Failed to generate course');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || errorData.message || 'Failed to generate course');
      }
    } catch (error) {
      console.error('Error generating course:', error);
      setError('Failed to generate course');
    } finally {
      setGenerating(false);
    }
  };

  // Fetch user's courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        setCourses(data.data || []);
      } else {
        console.error('Error fetching courses:', data.error?.message || data.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
            <button
              onClick={() => setShowGenerateForm(true)}
              disabled={generating}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookOpen className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate New Course'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {showGenerateForm && (
            <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Generate New Course</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={generateForm.language}
                    onChange={(e) => setGenerateForm({ ...generateForm, language: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.name}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    value={generateForm.expectedDuration}
                    onChange={(e) => setGenerateForm({ ...generateForm, expectedDuration: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Duration</option>
                    {durations.map((dur) => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateCourse}
                  disabled={generating}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <BookOpen className="w-4 h-4" />
                  {generating ? 'Generating...' : 'Generate Course'}
                </button>
                <button
                  onClick={() => { setShowGenerateForm(false); setGenerateForm({ language: '', expectedDuration: '' }); setError(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses yet. Generate your first course to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.language}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress?.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress?.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.total_units || 0} units</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.total_lessons || 0} lessons</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {(course.progress?.progressPercentage || 0) > 0 ? 'Continue Learning' : 'Start Course'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;