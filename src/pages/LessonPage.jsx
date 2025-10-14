import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, CheckCircle, Play, RotateCcw, Award } from 'lucide-react';

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState('vocabulary');
  const [exercises, setExercises] = useState([]);
  const [generatingExercises, setGeneratingExercises] = useState(false);

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        setLesson(data.data.lesson);
        setExercises(data.data.lesson.exercises || []);
      } else {
        const errorMessage = data.error?.message || data.message || 'Failed to fetch lesson details';
        setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch lesson details');
      }
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      setError('Failed to fetch lesson details');
    } finally {
      setLoading(false);
    }
  };

  const generateAdditionalExercises = async () => {
    setGeneratingExercises(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}/exercises`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        setExercises(prev => [...prev, ...(data.data || [])]);
      } else {
        console.error('Error generating exercises:', data.error?.message || data.message);
        // Optionally show user error, but for now just log
      }
    } catch (error) {
      console.error('Error generating exercises:', error);
    } finally {
      setGeneratingExercises(false);
    }
  };

  const markLessonComplete = async () => {
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
        // Refresh lesson data to show completion status
        fetchLessonDetails();
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
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
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
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            {lesson.completed && (
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
          
          {!lesson.completed && (
            <button
              onClick={markLessonComplete}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Award className="w-4 h-4" />
              Mark Complete
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Lesson Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 mb-4">{lesson.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{lesson.vocabulary_count || 0} vocabulary items</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{lesson.grammar_points_count || 0} grammar points</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{exercises.length} exercises</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['vocabulary', 'grammar', 'exercises'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentSection(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentSection === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {currentSection === 'vocabulary' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Vocabulary</h3>
                {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lesson.vocabulary.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-lg">{item.word}</span>
                          <span className="text-sm text-gray-600">[{item.pronunciation}]</span>
                        </div>
                        <p className="text-gray-700 mb-2">{item.translation}</p>
                        <p className="text-sm text-gray-600 italic">{item.example}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No vocabulary items for this lesson.</p>
                )}
              </div>
            )}

            {currentSection === 'grammar' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Grammar Points</h3>
                {lesson.grammar_points && lesson.grammar_points.length > 0 ? (
                  lesson.grammar_points.map((point, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{point.title}</h4>
                      <p className="text-gray-700 mb-3">{point.explanation}</p>
                      {point.examples && point.examples.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Examples:</h5>
                          <ul className="space-y-1">
                            {point.examples.map((example, idx) => (
                              <li key={idx} className="text-sm text-gray-600">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No grammar points for this lesson.</p>
                )}
              </div>
            )}

            {currentSection === 'exercises' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Exercises</h3>
                  <button
                    onClick={generateAdditionalExercises}
                    disabled={generatingExercises}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {generatingExercises ? 'Generating...' : 'Generate More'}
                  </button>
                </div>
                
                {exercises.length > 0 ? (
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium">Exercise {index + 1}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {exercise.type}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{exercise.question}</p>
                        {exercise.options && (
                          <div className="space-y-2">
                            {exercise.options.map((option, idx) => (
                              <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`exercise-${index}`}
                                  className="text-blue-600"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No exercises available for this lesson. Generate some to get started!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
