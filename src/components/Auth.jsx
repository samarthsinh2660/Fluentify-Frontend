import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup } from "../routes/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!validator.isEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;
      case 'name':
        if (!value.trim() && !isLogin) {
          newErrors.name = 'Name is required';
        } else {
          delete newErrors.name;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const fieldsToValidate = isLogin 
      ? [
          { name: 'email', value: form.email },
          { name: 'password', value: form.password }
        ]
      : [
          { name: 'name', value: form.name },
          { name: 'email', value: form.email },
          { name: 'password', value: form.password }
        ];
    
    let isValid = true;
    fieldsToValidate.forEach(({ name, value }) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    setIsLoading(true);
    
    try {
      let data;
      if (isLogin) {
        data = await login(form.role, form.email, form.password);
      } else {
        data = await signup(form.role, form.name, form.email, form.password);
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        navigate(form.role === "learner" ? "/dashboard" : "/admin-dashboard");
      } else {
        setErrors({ form: data.error || (isLogin ? "Login failed" : "Signup failed") });
      }
    } catch (err) {
      setErrors({ form: isLogin ? "Login failed. Please try again." : "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div 
        className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Left branding panel */}
        <motion.div 
          className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome {isLogin ? "Back" : "Aboard"}!
          </motion.h1>
          <motion.p 
            className="text-lg mb-6 text-center opacity-90"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ delay: 0.5 }}
          >
            {isLogin
              ? "Log in to access your dashboard and continue learning."
              : "Create your account and start your journey with us today."}
          </motion.p>
          <motion.div 
            className="text-sm opacity-80 mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.7 }}
          >
            <span>✨</span>
            <span>Powered by Fluentify</span>
          </motion.div>
        </motion.div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLogin ? (
                    <User className="w-7 h-7 text-white" />
                  ) : (
                    <UserPlus className="w-7 h-7 text-white" />
                  )}
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {isLogin ? "Welcome Back" : "Create Account"}
                </motion.h2>
                <motion.p 
                  className="text-gray-500 dark:text-gray-400 text-sm"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.9 }}
                  transition={{ delay: 0.2 }}
                >
                  {isLogin ? "Sign in to continue to your account" : "Join us to get started"}
                </motion.p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Role Selection */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {isLogin ? "I am a" : "I want to be a"}
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 appearance-none"
                    >
                      <option value="learner" className="dark:bg-gray-800">Learner</option>
                      <option value="admin" className="dark:bg-gray-800">Admin</option>
                    </select>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </motion.div>

                {/* Name Field */}
                {!isLogin && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Email Field */}
                <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    {isLogin && (
                      <button 
                        type="button" 
                        className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "••••••••" : "Create a password"}
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters
                    </p>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </motion.div>

                {/* Form Error */}
                <AnimatePresence>
                  {errors.form && (
                    <motion.div 
                      className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-300 flex items-start gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.form}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center ${
                      (isLoading || isSubmitting) ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading || isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : isLogin ? (
                      'Sign In'
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </motion.div>
              </form>

              {/* Toggle between Login/Signup */}
              <motion.div 
                className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
                variants={itemVariants}
              >
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-1.5 py-0.5 -mx-1.5"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-1.5 py-0.5 -mx-1.5"
                    >
                      Log in
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
