import React, { useState } from 'react';
import { Mail, User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useSignup } from '../../hooks/useAuth';
import { Button, ErrorMessage, Input } from '../../components';
import { PasswordInput } from './components';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Use React Query mutation
  const signupMutation = useSignup();

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
    if (!form.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    signupMutation.mutate(
      { 
        role: form.role, 
        name: form.name,
        email: form.email, 
        password: form.password 
      },
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
          setError(err.message || 'Signup failed');
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join us to get started</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I want to be a</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            >
              <option value="learner">Learner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Name */}
          <Input
            name="name"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
            icon={<User className="w-5 h-5" />}
          />

          {/* Email */}
          <Input
            name="email"
            type="email"
            label="Email Address"
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
            placeholder="Create a password"
            hint="Password must be at least 8 characters"
            required
          />

          {/* Error */}
          <ErrorMessage message={error} />

          {/* Submit */}
          <Button
            type="submit"
            loading={signupMutation.isPending}
            variant="success"
            className="w-full"
          >
            Create Account
          </Button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By signing up, you agree to our{' '}
            <button className="text-emerald-600 hover:text-emerald-500 underline">Terms of Service</button>{' '}
            and{' '}
            <button className="text-emerald-600 hover:text-emerald-500 underline">Privacy Policy</button>
          </p>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Already have an account?</span>{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-emerald-600 hover:text-emerald-500 font-medium"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
