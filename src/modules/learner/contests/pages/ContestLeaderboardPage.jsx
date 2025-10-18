/**
 * Contest Leaderboard Page
 * View contest rankings and user's position
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, Medal, Crown, ChevronLeft, Clock, 
  Target, Award, User, Users 
} from 'lucide-react';
import { useContestLeaderboard, useMySubmission } from "../../../../hooks/useContests";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import PageHeader from "../../../../components/PageHeader";

const ContestLeaderboardPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  
  const { data: leaderboardData, isLoading } = useContestLeaderboard(contestId);
  const { data: submissionData } = useMySubmission(contestId);

  const leaderboard = leaderboardData?.data || [];
  const mySubmission = submissionData?.data?.submission;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-700" />;
      default: return <span className="w-6 text-center font-bold text-gray-600">{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    // Keep all backgrounds white for clean, simple look
    return 'bg-white';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate('/contests')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Contests
        </button>

        <PageHeader 
          title="Leaderboard" 
          subtitle="Top performers in this contest"
          icon={<Trophy className="w-6 h-6" />}
          smallTitle={true}
        />
         {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <div className="mt-3 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-800">{leaderboard.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Top Score</p>
                  <p className="text-2xl font-bold text-gray-800">{leaderboard[0]?.score || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* My Submission Card */}
        {mySubmission && (
          <div className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-3 mb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1 text-xs">Your Rank</p>
                <p className="text-2xl font-bold">#{mySubmission.rank}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-right">
                <div>
                  <p className="text-green-100 text-xs">Score</p>
                  <p className="text-base font-bold">{mySubmission.score}</p>
                </div>
                <div>
                  <p className="text-green-100 text-xs">Accuracy</p>
                  <p className="text-base font-bold">{mySubmission.percentage.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-green-100 text-xs">Time</p>
                  <p className="text-base font-bold">{formatTime(mySubmission.timeTaken)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
            <div className="grid grid-cols-12 gap-4 font-semibold">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Learner</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Accuracy</div>
              <div className="col-span-2 text-center">Time</div>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="divide-y">
            {leaderboard.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No submissions yet</p>
                <p className="text-sm">Be the first to participate!</p>
              </div>
            ) : (
              leaderboard.map((entry, idx) => (
                <div
                  key={idx}
                  className={`
                    grid grid-cols-12 gap-4 p-4 items-center
                    ${getRankBg(entry.rank)}
                    ${entry.rank <= 3 ? 'font-semibold' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-white font-bold">
                      {entry.learnerName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{entry.learnerName}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      <Target className="w-4 h-4" />
                      <span className="font-bold">{entry.score}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      <Award className="w-4 h-4" />
                      <span className="font-bold">{entry.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(entry.timeTaken)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ContestLeaderboardPage;
