import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, Clock, CheckCircle, Lock, Play, Award, Flame } from 'lucide-react';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ progressPercentage: 0, lessonsCompleted: 0, unitsCompleted: 0 });
  const [stats, setStats] = useState(null);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  const calculateProgress = useCallback((unitsData) => {
    let totalLessons = 0;
    let completedLessons = 0;
    let completedUnits = 0;

    unitsData.forEach(unit => {
      const unitLessons = unit.lessons || [];
      const unitTotal = unitLessons.length;
      const unitCompleted = unitLessons.filter(lesson => lesson.isCompleted).length;
      
      totalLessons += unitTotal;
      completedLessons += unitCompleted;
      
      if (unitTotal > 0 && unitCompleted === unitTotal) {
        completedUnits += 1;
      }
    });

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100 * 10) / 10 : 0;

    return {
      progressPercentage,
      lessonsCompleted: completedLessons,
      unitsCompleted: completedUnits
    };
  }, []);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  // Also refetch when component becomes visible (user navigates back)
  // Temporarily disabled for debugging
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (!document.hidden) {
  //       fetchCourseDetails();
  //     }
  //   };

  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  // }, [fetchCourseDetails]);

  const fetchCourseDetails = useCallback(async () => {
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
        const statsData = data.data.stats || null;
        setStats(statsData);
        const unitsData = data.data.course.units || [];
        setUnits(unitsData);
        
        // Always calculate progress from actual lesson completion data
        const calculatedProgress = calculateProgress(unitsData);
        setProgress(calculatedProgress);
        
        // Calculate total XP from completed lessons
        const totalXpEarned = unitsData.reduce((total, unit) => {
          return total + (unit.lessons || []).reduce((unitTotal, lesson) => {
            const xp = lesson.xpEarned || lesson.xp_earned || 0;
            return unitTotal + (lesson.isCompleted ? xp : 0);
          }, 0);
        }, 0);
        
        setTotalXpEarned(totalXpEarned);
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
  }, [courseId]);

  const handleLessonClick = (lesson, unitId, unitIndex) => {
    if (!lesson.isUnlocked) {
      alert('🔒 This lesson is locked. Complete previous lessons first!');
      return;
    }

    // Use unit-aware navigation
    navigate(`/lesson/${courseId}/${unitId}/${lesson.id}`);
  };

  const handleUnitClick = (unit) => {
    if (!unit.isUnlocked) {
      alert('🔒 This unit is locked. Complete the previous unit first!');
    }
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
        // Lesson marked complete successfull
        // Note: CoursePage will refresh when user navigates back
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="font-semibold">{course.total_lessons || units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="font-semibold">{totalXpEarned}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="font-semibold">{stats?.current_streak || 0} days</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <span className="text-sm font-medium text-gray-700">{progress.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 text-center">
              {progress.lessonsCompleted} lessons completed • {progress.unitsCompleted} units completed
            </div>
          </div>
        </div>

        {/* Units and Lessons */}
        <div className="space-y-6">
                  {units.map((unit, unitIndex) => (
                    <div 
                      key={unit.id} 
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${!unit.isUnlocked ? 'opacity-60' : ''}`}
                      onClick={() => !unit.isUnlocked && handleUnitClick(unit)}
                    >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {unit.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : unit.isUnlocked ? (
                        <Play className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="text-lg font-semibold">{unit.title}</h3>
                      {!unit.isUnlocked && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">🔒 Locked</span>
                      )}
                      {unit.isCompleted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✅ Completed</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{unit.lessons ? unit.lessons.filter(l => l.isCompleted).length : 0}/{unit.lessons ? unit.lessons.length : 0} lessons</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unit.lessons && unit.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson, unit.id, unitIndex)}
                      className={`border rounded-lg p-4 transition-all ${
                        !lesson.isUnlocked 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                          : lesson.isCompleted 
                            ? 'border-green-200 bg-green-50 cursor-pointer hover:shadow-md' 
                            : 'border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {lesson.isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : lesson.isUnlocked ? (
                              <Play className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                            <h4 className="font-medium">{lesson.title}</h4>
                            <span className="text-xs text-gray-400">#{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                          
                          {lesson.isCompleted && (
                            <div className="flex items-center gap-3 text-xs text-green-700 mb-2">
                              <span className="bg-green-100 px-2 py-1 rounded">Score: {lesson.score}%</span>
                              <span className="bg-green-100 px-2 py-1 rounded">XP: +{lesson.xpEarned}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>⏱️ {lesson.estimatedDuration || 0} min</span>
                            <span>🎯 {lesson.xpReward || 0} XP</span>
                          </div>
                        </div>
                        
                        <div className="ml-2">
                          {lesson.isCompleted ? (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded font-medium">
                              ✅ Completed
                            </span>
                          ) : !lesson.isUnlocked ? (
                            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded font-medium">
                              🔒 Locked
                            </span>
                          ) : (
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-medium">
                              Start →
                            </span>
                          )}
                        </div>
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
