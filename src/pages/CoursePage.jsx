import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, Clock, CheckCircle, Lock, Play } from 'lucide-react';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        setCourse(data.data.course);
        setUnits(data.data.course.units || []);
      } else {
        const errorMessage = data.error?.message || data.message || 'Failed to fetch course details';
        setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch course details');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    navigate(`/lesson/${courseId}/${lesson.id}`);
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        // Refresh course data to update progress
        fetchCourseDetails();
      } else {
        console.error('Error marking lesson complete:', data.error?.message || data.message);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p>Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Language</p>
                <p className="font-semibold">{course.language}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="font-semibold">{course.total_lessons || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{course.expected_duration || '3 months'}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <span className="text-sm font-medium text-gray-700">{course.progress?.progressPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${course.progress?.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Units and Lessons */}
        <div className="space-y-6">
          {units.map((unit) => (
            <div key={unit.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{unit.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className={`w-4 h-4 ${unit.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    <span>{unit.completed_lessons || 0}/{unit.total_lessons || 0} lessons</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unit.lessons && unit.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        lesson.completed 
                          ? 'border-green-200 bg-green-50' 
                          : lesson.unlocked 
                            ? 'border-blue-200 bg-blue-50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : lesson.unlocked ? (
                              <Play className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                            <h4 className="font-medium">{lesson.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📚 {lesson.exercises_count || 0} exercises</span>
                            <span>📝 {lesson.vocabulary_count || 0} vocabulary</span>
                            <span>📖 {lesson.grammar_points_count || 0} grammar</span>
                          </div>
                        </div>
                        
                        {lesson.completed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markLessonComplete(lesson.id);
                            }}
                            className="text-green-600 text-sm font-medium"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
