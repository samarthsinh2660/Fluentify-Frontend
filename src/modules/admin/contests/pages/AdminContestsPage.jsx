/**
 * Admin Contests Management Page
 * View, manage, and create contests
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Plus, Edit, Trash2, Eye, BarChart3,
  Filter, Sparkles, Calendar, Users, Target, ChevronLeft
} from 'lucide-react';
import { useAdminContests, useDeleteContest, useUpdateContest } from "../../../../hooks/useContests";
import { LANGUAGES, EXPERTISE_LEVELS } from "../../../../utils/constants";
import PageHeader from "../../../../components/PageHeader";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Button from "../../../../components/Button";

const AdminContestsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  
  const { data, isLoading, refetch } = useAdminContests(filters);
  const deleteContest = useDeleteContest();
  const updateContest = useUpdateContest();

  const contests = data?.data || [];

  const handleDelete = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      try {
        await deleteContest.mutateAsync(contestId);
      } catch (error) {
        console.error('Failed to delete contest:', error);
        alert('Failed to delete contest');
      }
    }
  };

  const handleTogglePublish = async (contest) => {
    try {
      await updateContest.mutateAsync({
        contestId: contest.id,
        updates: { isPublished: !contest.isPublished }
      });
    } catch (error) {
      console.error('Failed to update contest:', error);
      alert('Failed to update contest');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <PageHeader 
          title="Contest Management" 
          subtitle="Create and manage language learning contests"
          icon={<Trophy className="w-8 h-8" />}
          smallTitle={true}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => navigate('/admin-contests/generate')}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Sparkles className="w-5 h-5" />
            Generate with AI
          </Button>
          <Button
            onClick={() => navigate('/admin-contests/create')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Manually
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={filters.language || ''}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.name}>{lang.name}</option>
              ))}
            </select>

            <select
              value={filters.difficulty_level || ''}
              onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Levels</option>
              {EXPERTISE_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={filters.contest_type || ''}
              onChange={(e) => handleFilterChange('contest_type', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              <option value="mcq">Multiple Choice</option>
              <option value="one-liner">One-Liner</option>
              <option value="mix">Mixed</option>
            </select>

            <select
              value={filters.is_published !== undefined ? String(filters.is_published) : ''}
              onChange={(e) => handleFilterChange('is_published', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        {/* Contests List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : contests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Contests Found</h3>
            <p className="text-gray-600 mb-6">Create your first contest to get started</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/admin-contests/generate')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate with AI
              </Button>
              <Button
                onClick={() => navigate('/admin-contests/create')}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{contest.title}</h3>
                        {contest.isPublished ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            Draft
                          </span>
                        )}
                        {contest.isAiGenerated && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Generated
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{contest.description}</p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-600">{contest.language} - {contest.difficultyLevel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600">{contest.totalQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">{contest.totalParticipants} participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">
                            {new Date(contest.startDate).toLocaleDateString()} - {new Date(contest.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/admin-contests/${contest.id}/stats`)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Statistics"
                      >
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin-contests/${contest.id}/edit`)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Contest"
                      >
                        <Edit className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(contest)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title={contest.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        <Eye className={`w-5 h-5 ${contest.isPublished ? 'text-green-600' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(contest.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Contest"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContestsPage;
