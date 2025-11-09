import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Trophy, 
  Flame,
  Edit
} from 'lucide-react';
import { getLearnerById, getLearnerCourses } from '../../../../api/userManagement';

const UserDetailsPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();

  // Fetch learner details
  const { data: learnerData, isLoading: learnerLoading, error: learnerError } = useQuery({
    queryKey: ['admin-learner', learnerId],
    queryFn: () => getLearnerById(learnerId),
  });

  // Fetch learner courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['admin-learner-courses', learnerId],
    queryFn: () => getLearnerCourses(learnerId),
  });

  const learner = learnerData?.data;
  const courses = coursesData?.data || [];

  if (learnerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (learnerError || !learner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">Error loading user details: {learnerError?.message || 'User not found'}</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to User Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            </div>
            <button
              onClick={() => navigate(`/admin/users/${learnerId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit User
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{learner.name}</h2>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{learner.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Courses</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{learner.total_courses || 0}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Total XP</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{learner.total_xp || 0}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Lessons Done</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{learner.total_lessons_completed || 0}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Streak</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{learner.current_streak || 0} days</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Joined: {new Date(learner.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Enrolled Courses</h3>
          
          {coursesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No courses enrolled yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.language} Course</h4>
                      <p className="text-sm text-gray-600">Expected Duration: {course.expected_duration}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Started: {new Date(course.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-purple-600">{course.total_xp}</span> XP
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold text-green-600">{course.lessons_completed}</span> lessons
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDetailsPage;
