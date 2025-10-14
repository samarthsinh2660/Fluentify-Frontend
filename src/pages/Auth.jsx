import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Shield, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { login, signup } from "../routes/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!validator.isEmail(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
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
        setError(data.error || (isLogin ? "Login failed" : "Signup failed"));
      }
    } catch (err) {
      setError(isLogin ? "Login failed" : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Left Panel - Branding */}
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                {isLogin ? "Welcome Back" : "Join Our Platform"}
              </h1>
              
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                {isLogin
                  ? "Sign in to access your personalized learning dashboard and continue your educational journey."
                  : "Create your account today and unlock a world of learning opportunities tailored just for you."}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Personalized Learning Experience</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Expert-Curated Content</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Progress Tracking & Analytics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:w-7/12 p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 shadow-lg">
                  {isLogin ? (
                    <User className="w-8 h-8 text-white" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  {isLogin ? "Sign In" : "Create Account"}
                </h2>
                
                <p className="text-slate-500 text-lg">
                  {isLogin ? "Welcome back! Please sign in to continue" : "Get started with your free account"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "learner" })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        form.role === "learner"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium text-sm">Learner</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "admin" })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        form.role === "admin"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Shield className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium text-sm">Admin</div>
                    </button>
                  </div>
                </div>

                {/* Name Field (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="mt-2 text-sm text-slate-500">
                      Must be at least 8 characters with a mix of letters and numbers
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                    </div>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </button>

                {/* Toggle Login/Signup */}
                <div className="text-center pt-6">
                  <p className="text-slate-500 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </div>
              </form>

              {/* Terms & Privacy (Sign Up Only) */}
              {!isLogin && (
                <p className="text-center text-xs text-slate-400 mt-6">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;