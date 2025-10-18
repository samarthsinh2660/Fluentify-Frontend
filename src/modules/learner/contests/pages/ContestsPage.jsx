/**
 * Contests Browse Page for Learners
 * Browse and filter available contests
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Calendar, Clock, Target, Users, 
  ChevronRight, Filter, Search, Loader2, Award, ChevronLeft, CheckCircle2 
} from 'lucide-react';
import { useBrowseContests } from "../../../../hooks/useContests";
import { LANGUAGES } from "../../../../utils/constants";
import PageHeader from "../../../../components/PageHeader";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const ContestsPage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { data, isLoading } = useBrowseContests(selectedLanguage);

  const contests = data?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🔴';
      case 'upcoming': return '🔜';
      case 'ended': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <PageHeader 
          title="Contests" 
          subtitle="Challenge yourself and compete with other learners"
          icon={<Trophy className="w-8 h-8" />}
        />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedLanguage || ''}
              onChange={(e) => setSelectedLanguage(e.target.value || null)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contests Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : contests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Contests Available</h3>
            <p className="text-gray-600">
              {selectedLanguage 
                ? `No contests found for ${selectedLanguage}`
                : 'Check back later for new contests!'
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <div
                key={contest.id}
                onClick={() => contest.hasSubmitted 
                  ? navigate(`/contests/${contest.id}/leaderboard`) 
                  : navigate(`/contests/${contest.id}`)
                }
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group ${contest.hasSubmitted ? 'ring-2 ring-green-200' : ''}`}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contest.status)}`}>
                        {getStatusIcon(contest.status)} {contest.status.toUpperCase()}
                      </span>
                      {contest.hasSubmitted && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                          <CheckCircle2 className="w-3 h-3" />
                          SUBMITTED
                        </span>
                      )}
                    </div>
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:scale-105 transition-transform">
                    {contest.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {contest.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{contest.language}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{contest.difficultyLevel}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{contest.timeLimit ? `${contest.timeLimit} min` : 'No time limit'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>{contest.totalParticipants} participants</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-green-600">{contest.rewardPoints} pts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {contest.hasSubmitted ? (
                        <span className="text-green-600">View Score</span>
                      ) : (
                        <span className="text-gray-600">Take Contest</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
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

export default ContestsPage;
