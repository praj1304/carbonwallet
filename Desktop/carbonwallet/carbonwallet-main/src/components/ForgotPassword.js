import React, { useState } from 'react';
import { Leaf, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import API from '../api'; // ✅ axios instance

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-4">
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">CarbonWallet</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Check Your Email
            </h2>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>

            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                Didn’t receive the email? Check your spam folder or try again later.
              </p>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-4">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">CarbonWallet</h1>
          <p className="text-green-100 text-lg">Reset Your Password</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Login</span>
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Forgot Password?
          </h2>

          <p className="text-gray-600 text-center mb-6 text-sm">
            Enter your email and we’ll send you a reset link.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 border-2 ${
                  error ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                placeholder="you@example.com"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={onBackToLogin}
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
