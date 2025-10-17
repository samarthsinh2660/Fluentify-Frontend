import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Play, RotateCcw, Award } from 'lucide-react';
import { useLessonDetails, useGenerateExercises, useCompleteLesson } from '../../hooks/useCourses';
import { PageHeader, Button, SkeletonPageHeader, SkeletonCard, SkeletonText } from '../../components';

const LessonPage = () => {
  const { courseId, unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('vocabulary');
  
  // React Query hooks
  const { data, isLoading: loading, error: queryError } = useLessonDetails({
    courseId: Number(courseId),
    unitId: Number(unitId),
    lessonId: Number(lessonId)
  });
  
  const generateExercisesMutation = useGenerateExercises();
  const completeLessonMutation = useCompleteLesson();
  
  // Extract data
  const lesson = data?.data?.lesson;
  const lessonProgress = data?.data?.progress;
  const exercises = lesson?.exercises || [];
  const error = queryError?.message;

  // Helper function to check if lesson is truly completed
  const isLessonCompleted = () => {
    return lessonProgress?.is_completed === true;
  };

  const generateAdditionalExercises = () => {
    generateExercisesMutation.mutate({
      courseId: Number(courseId),
      unitId: Number(unitId),
      lessonId: Number(lessonId)
    });
  };

  const markLessonComplete = () => {
    completeLessonMutation.mutate({
      courseId: Number(courseId),
      unitId: Number(unitId),
      lessonId: Number(lessonId),
      score: 100,
      exercises: []
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <SkeletonPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Lesson overview skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="space-y-4">
              <SkeletonText lines={2} />
              <div className="flex gap-6 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            {/* Tabs skeleton */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Content cards skeleton */}
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>{lesson.title}</span>
            {isLessonCompleted() && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-normal">
                ✓ Completed
              </span>
            )}
          </div>
        }
        showBack
        actions={
          !isLessonCompleted() && (
            <Button
              onClick={markLessonComplete}
              loading={completeLessonMutation.isPending}
              variant="success"
              icon={<Award className="w-4 h-4" />}
            >
              Mark Complete
            </Button>
          )
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Lesson Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 mb-4">{lesson.description}</p>
          
          {isLessonCompleted() && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Award className="w-5 h-5" />
                <span className="font-medium">Score: {lessonProgress.score}%</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Target className="w-5 h-5" />
                <span className="font-medium">XP Earned: +{lessonProgress.xp_earned}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{lesson.vocabulary?.length || 0} vocabulary items</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{lesson.grammar_points?.length || 0} grammar points</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{exercises.length} exercises</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{lesson.xpReward || 0} XP</span>
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
                  <Button
                    onClick={generateAdditionalExercises}
                    loading={generateExercisesMutation.isPending}
                    size="sm"
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    Generate More
                  </Button>
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
