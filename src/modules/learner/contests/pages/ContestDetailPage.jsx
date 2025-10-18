/**
 * Contest Detail Page for Learners
 * View contest details, take quiz, and see results
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, Calendar, Clock, Target, Users, Award,
  ChevronLeft, Play, CheckCircle2, XCircle, Loader2,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { useContestDetails, useMySubmission, useSubmitContest } from "../../../../hooks/useContests";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Button from "../../../../components/Button";

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const { data: contestData, isLoading } = useContestDetails(contestId);
  const { data: submissionData } = useMySubmission(contestId);
  const submitContest = useSubmitContest();

  const contest = contestData?.data?.contest;
  const submission = submissionData?.data?.submission;
  const hasSubmitted = contest?.hasSubmitted || !!submission;

  // Initialize answers array
  useEffect(() => {
    if (contest && !answers.length) {
      setAnswers(new Array(contest.totalQuestions).fill(''));
    }
  }, [contest]);

  // Timer logic
  useEffect(() => {
    if (isStarted && contest?.timeLimit && startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = (contest.timeLimit * 60) - elapsed;
        
        if (remaining <= 0) {
          handleSubmit();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStarted, startTime, contest]);

  const handleStart = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    if (contest?.timeLimit) {
      setTimeLeft(contest.timeLimit * 60);
    }
  };

  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < contest.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
      return;
    }

    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    try {
      const result = await submitContest.mutateAsync({
        contestId: parseInt(contestId),
        answers,
        timeTaken,
      });
      
      // Redirect directly to leaderboard
      navigate(`/contests/${contestId}/leaderboard`);
    } catch (error) {
      console.error('Failed to submit:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to submit contest';
      
      if (errorMessage.includes('already submitted')) {
        alert('You have already submitted this contest. Redirecting to leaderboard...');
        navigate(`/contests/${contestId}/leaderboard`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <LoadingSpinner />;
  if (!contest) return <div className="p-6 text-center">Contest not found</div>;

  // Check contest status
  const contestStatus = contest.status;
  const isUpcoming = contestStatus === 'upcoming';
  const isEnded = contestStatus === 'ended';
  const canParticipate = contestStatus === 'active' && !hasSubmitted;

  const question = contest.questions?.[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <button
          onClick={() => navigate('/contests')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Contests
        </button>

        {/* Contest Info Card */}
        {!isStarted && !hasSubmitted && !isUpcoming && !isEnded && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{contest.title}</h1>
                <p className="text-gray-600">{contest.description}</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Language & Level</p>
                  <p className="font-semibold">{contest.language} - {contest.difficultyLevel}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time Limit</p>
                  <p className="font-semibold">
                    {contest.timeLimit ? `${contest.timeLimit} minutes` : 'No limit'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="font-semibold">{contest.totalQuestions} questions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Reward Points</p>
                  <p className="font-semibold">{contest.rewardPoints} points</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStart}
              disabled={!canParticipate}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              Start Contest
            </Button>
          </div>
        )}

        {/* Quiz Interface */}
        {isStarted && !showResults && question && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Timer & Progress */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestion + 1} of {contest.totalQuestions}
                </span>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                    style={{ width: `${((currentQuestion + 1) / contest.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              {timeLeft !== null && (
                <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

              {question.type === 'mcq' && (
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${answers[currentQuestion] === option.charAt(0)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.charAt(0)}
                        checked={answers[currentQuestion] === option.charAt(0)}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-5 h-5 text-green-600"
                      />
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'one-liner' && (
                <input
                  type="text"
                  value={answers[currentQuestion]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentQuestion === contest.totalQuestions - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitContest.isPending}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {submitContest.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Contest
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Contest */}
        {isUpcoming && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Contest Upcoming</h2>
            <p className="text-gray-600 mb-6">This contest hasn't started yet. Please check back later.</p>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
              <Calendar className="w-5 h-5" />
              <span>Starts: {new Date(contest.startDate).toLocaleString()}</span>
            </div>
            <Button onClick={() => navigate('/contests')} variant="secondary">
              Browse Other Contests
            </Button>
          </div>
        )}

        {/* Ended Contest */}
        {isEnded && !hasSubmitted && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Contest Ended</h2>
            <p className="text-gray-600 mb-6">This contest has ended. You can no longer participate.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(`/contests/${contestId}/leaderboard`)}>
                View Leaderboard
              </Button>
              <Button onClick={() => navigate('/contests')} variant="secondary">
                Browse More Contests
              </Button>
            </div>
          </div>
        )}

        {/* Already Submitted */}
        {hasSubmitted && !showResults && !submission && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Submitted</h2>
            <p className="text-gray-600 mb-6">You have already submitted this contest</p>
            <Button onClick={() => navigate(`/contests/${contestId}/leaderboard`)}>
              View Leaderboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestDetailPage;
