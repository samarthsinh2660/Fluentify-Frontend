import React, { useState } from 'react';
import { Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useLogin } from '../../hooks/useAuth';
import { Button, ErrorMessage, Input } from '../../components';
import { PasswordInput } from './components';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Use React Query mutation
  const loginMutation = useLogin();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!validator.isEmail(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    loginMutation.mutate(
      { role: form.role, email: form.email, password: form.password },
      {
        onSuccess: (data) => {
          // Navigate based on role
          if (form.role === 'learner') {
            navigate('/dashboard');
          } else {
            navigate('/admin-dashboard');
          }
        },
        onError: (err) => {
          setError(err.message || 'Login failed');
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <User className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            >
              <option value="learner">Learner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            icon={<Mail className="w-5 h-5" />}
          />

          {/* Password */}
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {/* Error */}
          <ErrorMessage message={error} />

          {/* Submit */}
          <Button
            type="submit"
            loading={loginMutation.isPending}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Don't have an account?</span>{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
