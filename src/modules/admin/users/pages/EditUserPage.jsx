import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { getLearnerById, updateLearner, updateLearnerPassword } from '../../../../api/userManagement';
import { useToast } from '../../../../contexts/ToastContext';

const EditUserPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Fetch learner details
  const { data: learnerData, isLoading } = useQuery({
    queryKey: ['admin-learner', learnerId],
    queryFn: () => getLearnerById(learnerId),
  });

  // Update form fields when data is loaded
  React.useEffect(() => {
    const learner = learnerData?.data;
    if (learner) {
      setName(learner.name);
      setEmail(learner.email);
    }
  }, [learnerData]);

  // Update learner mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateLearner(learnerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-learner', learnerId]);
      queryClient.invalidateQueries(['admin-learners']);
      toast.success('User updated successfully!');
      setTimeout(() => navigate(`/admin/users/${learnerId}`), 500);
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (password) => updateLearnerPassword(learnerId, password),
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    },
    onError: (error) => {
      toast.error(`Failed to update password: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.warning('Name and email are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.warning('Please enter a valid email address');
      return;
    }

    updateMutation.mutate({ name: name.trim(), email: email.trim() });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.warning('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    updatePasswordMutation.mutate(password);
  };

  const learner = learnerData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!learner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">User not found</p>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/users/${learnerId}`)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Basic Info Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Update Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Password</h2>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            )}
          </div>

          {showPasswordSection ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('');
                    setConfirmPassword('');
                    setShowPasswordSection(false);
                  }}
                  className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600 text-sm">
              Click "Change Password" to update the user's password
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditUserPage;
