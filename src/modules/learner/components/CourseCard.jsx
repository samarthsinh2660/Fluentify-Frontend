import React, { useState } from 'react';
import { BookOpen, Flame, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { deleteCourse } from '../../../api/courses';
import { useCourses } from '../../../hooks/useCourses';

/**
 * Course Card Component
 * @param {Object} props
 * @param {Object} props.course - Course object
 * @param {Function} props.onClick - Click handler
 */
const CourseCard = ({ course, onClick }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // React Query refetch
  const { refetch } = useCourses();
  
  const progress = course.progress || {};
  const progressPercentage = progress.progressPercentage || 0;
  
  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      setDeleting(true);
      await deleteCourse(course.id);
      await refetch(); // Refresh the courses list
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Delete Course?</h4>
              <p className="text-sm text-gray-600 mb-4">
                This will permanently delete "{course.title}". This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{course.language}</p>
          
          {/* Course Stats */}
          <div className="text-xs text-gray-500 mb-3">
            {course.totalUnits && course.totalLessons && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>{course.totalUnits} units • {course.totalLessons} lessons</span>
              </div>
            )}
          </div>
          
          {/* Difficulty and Duration */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              {course.expectedDuration || '3 months'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {course.expertise || course.difficulty || 'Beginner'}
            </span>
            {course.createdAt && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            title="Delete Course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>{progress.currentStreak || 0} day streak</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{progress.unitsCompleted || 0} units done</span>
        </div>
      </div>
      
      <button
        onClick={() => onClick(course)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
      </button>
    </div>
  );
};

export default CourseCard;
