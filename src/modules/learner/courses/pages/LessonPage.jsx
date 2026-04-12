import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Play, RotateCcw, Award, CheckCircle, XCircle, Send, ArrowRight, Brain, Zap } from 'lucide-react';
import { useLessonDetails, useGenerateExercises, useCompleteLesson, useRetryLesson } from "../../../../hooks/useCourses";
import { useRecommendations } from "../../../../hooks/useRecommendations";
import { PageHeader, Button, SkeletonPageHeader, SkeletonCard, SkeletonText } from "../../../../components";

const LessonPage = () => {
  const { courseId, unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('vocabulary');

  // Exercise quiz state
  const [answers, setAnswers] = useState({});       // { exerciseIndex: selectedOptionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // React Query hooks
  const { data, isLoading: loading, error: queryError } = useLessonDetails({
    courseId: Number(courseId),
    unitId: Number(unitId),
    lessonId: Number(lessonId)
  });

  const generateExercisesMutation = useGenerateExercises();
  const completeLessonMutation = useCompleteLesson();
  const retryLessonMutation = useRetryLesson();

  // Whether the user is in "retry mode" on an already-completed lesson
  const [retryMode, setRetryMode] = useState(false);

  // Extract data
  const lesson = data?.data?.lesson;
  const lessonProgress = data?.data?.progress;
  const exercises = lesson?.exercises || [];
  const error = queryError?.message;

  const isLessonCompleted = () => lessonProgress?.is_completed === true;
  const lessonDone = isLessonCompleted() || completeLessonMutation.isSuccess;

  // Fetch next A* recommendation — enabled once this lesson is done
  const { data: recData } = useRecommendations(lessonDone ? courseId : null);

  // Calculate quiz results after submission
  const quizResults = useMemo(() => {
    if (!quizSubmitted || exercises.length === 0) return null;

    const results = exercises.map((ex, i) => ({
      isCorrect: answers[i] === ex.correctAnswer,
      userAnswer: ex.options?.[answers[i]] ?? '',
      selectedIndex: answers[i] ?? -1,
      correctIndex: ex.correctAnswer,
    }));

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / exercises.length) * 100);

    return { results, correctCount, score };
  }, [quizSubmitted, answers, exercises]);

  const allAnswered = exercises.length > 0 && exercises.every((_, i) => answers[i] !== undefined);

  const handleSelectAnswer = (exerciseIndex, optionIndex) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [exerciseIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!allAnswered) return;
    setQuizSubmitted(true);
  };

  const handleRetryQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const generateAdditionalExercises = () => {
    generateExercisesMutation.mutate({
      courseId: Number(courseId),
      unitId: Number(unitId),
      lessonId: Number(lessonId)
    });
  };

  const buildSubmitPayload = () => {
    const exerciseAttempts = quizResults
      ? quizResults.results.map(r => ({ isCorrect: r.isCorrect, userAnswer: r.userAnswer }))
      : [];
    const score = quizResults ? quizResults.score : 100;
    return { courseId: Number(courseId), unitId: Number(unitId), lessonId: Number(lessonId), score, exercises: exerciseAttempts };
  };

  const markLessonComplete = () => completeLessonMutation.mutate(buildSubmitPayload());

  const submitRetry = () => {
    retryLessonMutation.mutate(buildSubmitPayload());
    setRetryMode(false);
  };

  const startRetry = () => {
    setAnswers({});
    setQuizSubmitted(false);
    setRetryMode(true);
    setCurrentSection('exercises');
  };

  // Can submit if: no exercises (just content), or quiz submitted
  const canMarkComplete = exercises.length === 0 || quizSubmitted;

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <SkeletonPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
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
          isLessonCompleted() && !retryMode
            ? (
              <Button
                onClick={startRetry}
                variant="outline"
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Retake Quiz
              </Button>
            )
            : retryMode && quizSubmitted
            ? (
              <Button
                onClick={submitRetry}
                loading={retryLessonMutation.isPending}
                variant="success"
                icon={<Award className="w-4 h-4" />}
              >
                Update Mastery ({quizResults?.score}%)
              </Button>
            )
            : !isLessonCompleted() && canMarkComplete
            ? (
              <Button
                onClick={markLessonComplete}
                loading={completeLessonMutation.isPending}
                variant="success"
                icon={<Award className="w-4 h-4" />}
              >
                {quizResults ? `Complete (Score: ${quizResults.score}%)` : 'Mark Complete'}
              </Button>
            )
            : null
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Lesson Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 mb-4">{lesson.description}</p>

          {isLessonCompleted() && !retryMode && !retryLessonMutation.isSuccess && (
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
          {retryLessonMutation.isSuccess && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-medium text-blue-900">Mastery updated!</p>
                <p className="text-xs text-blue-700">
                  New score: {retryLessonMutation.data?.data?.score ?? '—'}% · Your A* recommendations have been refreshed.
                </p>
              </div>
            </div>
          )}

          {/* Quiz score banner (before marking complete) */}
          {!isLessonCompleted() && quizResults && (
            <div className={`flex items-center gap-4 mb-4 p-3 rounded-lg border ${
              quizResults.score >= 80
                ? 'bg-green-50 border-green-200'
                : quizResults.score >= 50
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {quizResults.score >= 80
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <Target className="w-5 h-5 text-yellow-600" />}
                <span className="font-semibold text-lg">
                  Quiz Score: {quizResults.score}%
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {quizResults.correctCount} / {exercises.length} correct
              </span>
              {quizResults.score < 80 && (
                <span className="text-xs text-gray-500">
                  (You can still complete, but review weak areas!)
                </span>
              )}
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
                  {tab === 'exercises' && quizResults && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      quizResults.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {quizResults.score}%
                    </span>
                  )}
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
                  <div className="flex items-center gap-2">
                    {quizSubmitted && !isLessonCompleted() && (
                      <Button
                        onClick={handleRetryQuiz}
                        size="sm"
                        variant="outline"
                        icon={<RotateCcw className="w-4 h-4" />}
                      >
                        Retry Quiz
                      </Button>
                    )}
                    {!isLessonCompleted() && (
                      <Button
                        onClick={generateAdditionalExercises}
                        loading={generateExercisesMutation.isPending}
                        size="sm"
                        icon={<RotateCcw className="w-4 h-4" />}
                      >
                        Generate More
                      </Button>
                    )}
                  </div>
                </div>

                {exercises.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {exercises.map((exercise, index) => {
                        const selected = answers[index];
                        const result = quizResults?.results[index];

                        return (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 transition-colors ${
                              result
                                ? result.isCorrect
                                  ? 'border-green-300 bg-green-50/50'
                                  : 'border-red-300 bg-red-50/50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Exercise {index + 1}</span>
                                {result && (
                                  result.isCorrect
                                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                                    : <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {exercise.type}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{exercise.question}</p>
                            {exercise.options && (
                              <div className="space-y-2">
                                {exercise.options.map((option, idx) => {
                                  const isSelected = selected === idx;
                                  const isCorrectOption = exercise.correctAnswer === idx;

                                  let optionStyle = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
                                  if (!quizSubmitted && isSelected) {
                                    optionStyle = 'border-blue-500 bg-blue-50 ring-1 ring-blue-500';
                                  } else if (quizSubmitted) {
                                    if (isCorrectOption) {
                                      optionStyle = 'border-green-500 bg-green-50';
                                    } else if (isSelected && !isCorrectOption) {
                                      optionStyle = 'border-red-500 bg-red-50';
                                    } else {
                                      optionStyle = 'border-gray-200 opacity-60';
                                    }
                                  }

                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      disabled={quizSubmitted || isLessonCompleted()}
                                      onClick={() => handleSelectAnswer(index, idx)}
                                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all ${optionStyle}`}
                                    >
                                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium shrink-0 ${
                                        isSelected && !quizSubmitted
                                          ? 'border-blue-500 bg-blue-500 text-white'
                                          : quizSubmitted && isCorrectOption
                                            ? 'border-green-500 bg-green-500 text-white'
                                            : quizSubmitted && isSelected
                                              ? 'border-red-500 bg-red-500 text-white'
                                              : 'border-gray-300 text-gray-500'
                                      }`}>
                                        {String.fromCharCode(65 + idx)}
                                      </span>
                                      <span className="flex-1">{option}</span>
                                      {quizSubmitted && isCorrectOption && (
                                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                      )}
                                      {quizSubmitted && isSelected && !isCorrectOption && (
                                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit / Result actions */}
                    {!isLessonCompleted() && !quizSubmitted && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          {allAnswered
                            ? 'All questions answered. Ready to submit!'
                            : `${Object.keys(answers).length} / ${exercises.length} answered`}
                        </p>
                        <Button
                          onClick={handleSubmitQuiz}
                          disabled={!allAnswered}
                          variant="primary"
                          icon={<Send className="w-4 h-4" />}
                        >
                          Submit Quiz
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">No exercises available for this lesson. Generate some to get started!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prompt to take quiz before completing */}
        {!isLessonCompleted() && !quizSubmitted && exercises.length > 0 && currentSection !== 'exercises' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Ready to test your knowledge?</p>
              <p className="text-sm text-blue-700">Complete the exercises to get your score and unlock lesson completion.</p>
            </div>
            <Button
              onClick={() => setCurrentSection('exercises')}
              size="sm"
              icon={<Play className="w-4 h-4" />}
            >
              Take Quiz
            </Button>
          </div>
        )}

        {/* What's Next — shown after lesson is done, pulls fresh A* recommendation */}
        {lessonDone && (() => {
          const recs = recData?.data?.recommendations ?? [];
          // Skip the recommendation if it's the same lesson the user just finished
          const next = recs.find(r => !(r.unitNumber == unitId && r.lessonNumber == lessonId));
          return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">What's Next — A* Recommendation</h3>
              </div>
              {next ? (
                <div
                  onClick={() => navigate(`/lesson/${courseId}/${next.unitNumber}/${next.lessonNumber}`)}
                  className="cursor-pointer flex items-center justify-between gap-4 p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{next.conceptLabel}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium capitalize">{next.conceptType}</span>
                      {next.urgency === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">High priority</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{next.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      {next.estimatedMasteryTime}m
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-700">
                      Start <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Great work! All concepts are on track. Head back to your{' '}
                  <button onClick={() => navigate('/dashboard')} className="text-green-600 font-medium hover:underline">
                    dashboard
                  </button>{' '}
                  to see your updated learning path.
                </p>
              )}
            </div>
          );
        })()}
      </main>
    </div>
  );
};

export default LessonPage;
