/**
 * Contest Statistics Page
 * View detailed statistics for a contest
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, BarChart3, Users, Trophy, Target,
  TrendingUp, Award
} from 'lucide-react';
import { useContestStats, useContestDetails, useContestLeaderboard } from "../../../../hooks/useContests";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import PageHeader from "../../../../components/PageHeader";

const ContestStatsPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  
  const { data: statsData, isLoading: statsLoading } = useContestStats(contestId);
  const { data: contestData, isLoading: contestLoading } = useContestDetails(contestId);
  const { data: leaderboardData } = useContestLeaderboard(contestId, 10);

  const stats = statsData?.data?.stats;
  const contest = contestData?.data?.contest;
  const topPerformers = leaderboardData?.data || [];

  if (statsLoading || contestLoading) return <LoadingSpinner />;
  if (!stats || !contest) return <div className="p-6 text-center">Data not available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate('/admin-contests')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Contests
        </button>

        <PageHeader 
          title={contest.title}
          subtitle="Contest Statistics & Performance"
          icon={<BarChart3 className="w-8 h-8" />}
          smallTitle={true}
        />

        {/* Contest Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Contest Overview
          </h3>
          
          <div className="flex items-center justify-center gap-8 flex-wrap mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalParticipants}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-gray-800">{stats.highestScore}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averageScore.toFixed(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Percentage</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averagePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contest Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Contest Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Language</span>
                <span className="font-semibold text-gray-800">{contest.language}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Difficulty</span>
                <span className="font-semibold text-gray-800">{contest.difficultyLevel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-800 capitalize">{contest.contestType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Questions</span>
                <span className="font-semibold text-gray-800">{contest.totalQuestions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Time Limit</span>
                <span className="font-semibold text-gray-800">
                  {contest.timeLimit ? `${contest.timeLimit} min` : 'No limit'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Reward Points</span>
                <span className="font-semibold text-gray-800">{contest.rewardPoints}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  contest.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {contest.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Top 10 Performers
            </h3>
            
            {topPerformers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topPerformers.map((performer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${idx === 0 ? 'bg-yellow-400 text-white' : 
                          idx === 1 ? 'bg-gray-300 text-white' : 
                          idx === 2 ? 'bg-amber-600 text-white' : 
                          'bg-green-100 text-green-700'}
                      `}>
                        {performer.rank}
                      </div>
                      <span className="font-medium text-gray-800">{performer.learnerName}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{performer.score}</p>
                      <p className="text-xs text-gray-500">{performer.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestStatsPage;
