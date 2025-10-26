/**
 * Edit Contest Page
 * Admin page to edit existing contests
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Loader2, Trophy, Plus, Trash2, Edit3
} from 'lucide-react';
import { useContestDetails, useUpdateContest } from "../../../../hooks/useContests";
import { LANGUAGES, EXPERTISE_LEVELS } from "../../../../utils/constants";
import Button from "../../../../components/Button";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import PageHeader from "../../../../components/PageHeader";

const EditContestPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  
  const { data: contestData, isLoading } = useContestDetails(contestId);
  const updateContest = useUpdateContest();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    difficultyLevel: '',
    contestType: 'mcq',
    questions: [],
    startDate: '',
    endDate: '',
    rewardPoints: 100,
    maxAttempts: 1,
    timeLimit: 30,
    isPublished: false,
  });

  // Initialize form with contest data
  useEffect(() => {
    if (contestData?.data?.contest) {
      const contest = contestData.data.contest;
      setFormData({
        title: contest.title || '',
        description: contest.description || '',
        language: contest.language || '',
        difficultyLevel: contest.difficultyLevel || '',
        contestType: contest.contestType || 'mcq',
        questions: contest.questions || [],
        startDate: contest.startDate ? (() => {
          const date = new Date(contest.startDate);
          // Adjust for timezone offset to display in local time
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          return date.toISOString().slice(0, 16);
        })() : '',
        endDate: contest.endDate ? (() => {
          const date = new Date(contest.endDate);
          // Adjust for timezone offset to display in local time
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          return date.toISOString().slice(0, 16);
        })() : '',
        rewardPoints: contest.rewardPoints || 100,
        maxAttempts: contest.maxAttempts || 1,
        timeLimit: contest.timeLimit || 30,
        isPublished: contest.isPublished || false,
      });
    }
  }, [contestData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionsChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    const newQuestion = {
      type: 'mcq',
      question: '',
      options: ['A) ', 'B) ', 'C) ', 'D) '],
      correctAnswer: 'A',
      explanation: ''
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const deleteQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updates = {
        title: formData.title,
        description: formData.description,
        language: formData.language,
        difficultyLevel: formData.difficultyLevel,
        contestType: formData.contestType,
        questions: formData.questions,
        totalQuestions: formData.questions.length,
        rewardPoints: parseInt(formData.rewardPoints),
        maxAttempts: parseInt(formData.maxAttempts),
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
        isPublished: formData.isPublished,
      };

      if (formData.startDate) {
        // Convert local datetime input to UTC for server
        const localDate = new Date(formData.startDate);
        updates.startDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
      }
      if (formData.endDate) {
        // Convert local datetime input to UTC for server
        const localDate = new Date(formData.endDate);
        updates.endDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
      }

      await updateContest.mutateAsync({
        contestId: parseInt(contestId),
        updates,
      });

      navigate('/admin-contests');
    } catch (error) {
      console.error('Failed to update contest:', error);
      alert(error.message || 'Failed to update contest. Please try again.');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate('/admin-contests')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Contests
        </button>

        <PageHeader 
          title="Edit Contest" 
          subtitle="Modify contest details and questions"
          icon={<Edit3 className="w-8 h-8" />}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.name}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {EXPERTISE_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.contestType}
                    onChange={(e) => handleChange('contestType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="one-liner">One-Liner</option>
                    <option value="mix">Mixed</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (min)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => handleChange('timeLimit', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Points
                  </label>
                  <input
                    type="number"
                    value={formData.rewardPoints}
                    onChange={(e) => handleChange('rewardPoints', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    value={formData.maxAttempts}
                    onChange={(e) => handleChange('maxAttempts', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Questions ({formData.questions.length})
              </h3>
              <Button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            <div className="space-y-6">
              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-700">Question {qIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(qIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="one-liner">One-Liner</option>
                      </select>
                    </div>

                    {question.type === 'mcq' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options
                          </label>
                          {question.options.map((option, oIndex) => (
                            <input
                              key={oIndex}
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionsChange(qIndex, oIndex, e.target.value)}
                              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ))}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answer
                          </label>
                          <select
                            value={question.correctAnswer}
                            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                      </>
                    )}

                    {question.type === 'one-liner' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer}
                          onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No questions added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateContest.isPending}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {updateContest.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/admin-contests')}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContestPage;
