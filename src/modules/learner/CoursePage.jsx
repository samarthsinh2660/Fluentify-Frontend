import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Award, Flame } from 'lucide-react';
import { useCourseDetails } from '../../hooks/useCourses';
import { calculateProgress, calculateTotalXP } from '../../utils/courseHelpers';
import { LoadingSpinner, PageHeader } from '../../components';
import { StatCard, UnitCard } from './components';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // React Query hook for course details
  const { data, isLoading: loading, error: queryError, refetch } = useCourseDetails(courseId);
  
  // Refetch data when component mounts (navigating back from lesson page)
  useEffect(() => {
    if (courseId) {
      refetch();
    }
  }, [courseId, refetch]);
  
  // Extract data from query response
  const course = data?.data?.course;
  const stats = data?.data?.stats || null;
  const units = course?.units || [];
  
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
    return <LoadingSpinner fullScreen text="Loading course..." />;
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
