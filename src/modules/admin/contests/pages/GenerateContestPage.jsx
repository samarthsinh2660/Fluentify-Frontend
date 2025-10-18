/**
 * Generate Contest with AI Page
 * Admin page to generate contests using AI
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ChevronLeft, Loader2, Trophy,
  Calendar, Clock, Award, Target
} from 'lucide-react';
import { useGenerateContest } from "../../../../hooks/useContests";
import { LANGUAGES, EXPERTISE_LEVELS } from "../../../../utils/constants";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import PageHeader from "../../../../components/PageHeader";

const GenerateContestPage = () => {
  const navigate = useNavigate();
  const generateContest = useGenerateContest();

  const [formData, setFormData] = useState({
    language: '',
    difficultyLevel: '',
    contestType: 'mcq',
    questionCount: 10,
    topic: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    rewardPoints: 100,
    maxAttempts: 1,
    timeLimit: 30,
    isPublished: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.language || !formData.difficultyLevel) {
      alert('Please select language and difficulty level');
      return;
    }

    try {
      const payload = {
        language: formData.language,
        difficultyLevel: formData.difficultyLevel,
        contestType: formData.contestType,
        questionCount: parseInt(formData.questionCount),
      };

      // Add optional fields only if provided
      if (formData.topic) payload.topic = formData.topic;
      if (formData.title) payload.title = formData.title;
      if (formData.description) payload.description = formData.description;
      if (formData.startDate) payload.startDate = new Date(formData.startDate).toISOString();
      if (formData.endDate) payload.endDate = new Date(formData.endDate).toISOString();
      if (formData.rewardPoints) payload.rewardPoints = parseInt(formData.rewardPoints);
      if (formData.maxAttempts) payload.maxAttempts = parseInt(formData.maxAttempts);
      if (formData.timeLimit) payload.timeLimit = parseInt(formData.timeLimit);
      payload.isPublished = formData.isPublished;

      const result = await generateContest.mutateAsync(payload);
      
      // Navigate to edit page to review generated contest
      navigate(`/admin-contests/${result.data.contest.id}/edit`);
    } catch (error) {
      console.error('Failed to generate contest:', error);
      alert(error.message || 'Failed to generate contest. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate('/admin-contests')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Contests
        </button>

        <PageHeader 
          title="Generate Contest with AI" 
          subtitle="Let AI create a contest based on your specifications"
          icon={<Sparkles className="w-8 h-8" />}
        />

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Required Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              Required Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select difficulty</option>
                  {EXPERTISE_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contest Type
                </label>
                <select
                  value={formData.contestType}
                  onChange={(e) => handleChange('contestType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="mcq">Multiple Choice Questions</option>
                  <option value="one-liner">One-Liner Answers</option>
                  <option value="mix">Mixed (MCQ + One-Liner)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={formData.questionCount}
                  onChange={(e) => handleChange('questionCount', e.target.value)}
                  min="5"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Optional Details (AI will generate if not provided)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Topic (Optional)
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  placeholder="e.g., Common Verbs, Food & Dining, Travel Phrases"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for general language questions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contest Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="AI will generate an attractive title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="AI will generate a description"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Contest Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Contest Settings
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => handleChange('timeLimit', e.target.value)}
                  min="0"
                  placeholder="0 for no limit"
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
                  min="0"
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
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publish immediately after generation
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={generateContest.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {generateContest.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Contest...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Contest
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

export default GenerateContestPage;
