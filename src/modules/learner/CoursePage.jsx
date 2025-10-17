import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Award, Flame } from 'lucide-react';
import { useCourseDetails } from '../../hooks/useCourses';
import { useStreaming } from '../../contexts/StreamingContext';
import { calculateProgress, calculateTotalXP } from '../../utils/courseHelpers';
import { PageHeader, SkeletonPageHeader, SkeletonCard, SkeletonUnitCard } from '../../components';
import { StatCard, UnitCard } from './components';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // React Query hook for course details
  const { data, isLoading: loading, error: queryError, refetch } = useCourseDetails(courseId);
  
  // Streaming context for real-time generation
  const { state: streamState } = useStreaming();
  
  // Check if this course is currently being generated
  const isGenerating = streamState.isGenerating && streamState.courseId === Number(courseId);
  
  // Refetch data when component mounts (navigating back from lesson page)
  useEffect(() => {
    if (courseId) {
      refetch();
    }
  }, [courseId, refetch]);
  
  // Extract data from query response
  const course = data?.data?.course;
  const stats = data?.data?.stats || null;
  let units = course?.units || [];
  
  // If generating, merge with stream state units
  if (isGenerating && streamState.units) {
    units = streamState.units.map((streamUnit, index) => {
      if (streamUnit) {
        // Use stream unit data but ensure first lesson of unit 1 is unlocked
        const isUnit1 = index === 0; // Unit 1 (0-indexed)
        const lessons = streamUnit.lessons?.map((lesson, lessonIndex) => ({
          ...lesson,
          isUnlocked: isUnit1 && lessonIndex === 0 ? true : lesson.isUnlocked || false
        })) || [];

        return {
          ...streamUnit,
          isUnlocked: true, // Generated units are unlocked
          isGenerating: false,
          lessons
        };
      } else if (streamState.currentGenerating === index + 1) {
        // Currently generating
        return {
          id: index + 1,
          title: `Unit ${index + 1}`,
          description: 'Generating...',
          isUnlocked: false,
          isGenerating: true,
          lessons: []
        };
      } else {
        // Not generated yet
        return {
          id: index + 1,
          title: `Unit ${index + 1}`,
          description: 'Waiting...',
          isUnlocked: false,
          isGenerating: false,
          lessons: []
        };
      }
    });
  }
  
  // Calculate progress and XP
  const progress = useMemo(() => calculateProgress(units), [units]);
  const totalXpEarned = useMemo(() => calculateTotalXP(units), [units]);
  
  // Error handling
  const error = queryError?.message;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <SkeletonPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          
          {/* Units skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <SkeletonUnitCard key={i} />
            ))}
          </div>
        </main>
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
      <PageHeader
        title={course.title}
        showBack
        onBack={() => navigate('/dashboard')}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={Target}
              label="Language"
              value={course.language}
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              icon={BookOpen}
              label="Total Lessons"
              value={course.total_lessons || units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0)}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              icon={Award}
              label="Total XP"
              value={totalXpEarned}
              bgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <StatCard
              icon={Flame}
              label="Streak"
              value={`${stats?.current_streak || 0} days`}
              bgColor="bg-orange-100"
              iconColor="text-orange-600"
            />
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
            <UnitCard
              key={unit.id}
              unit={unit}
              unitIndex={unitIndex}
              onLessonClick={handleLessonClick}
              onUnitClick={handleUnitClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
