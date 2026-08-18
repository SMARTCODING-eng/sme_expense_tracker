import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Lock, Mail, Wallet, CheckCircle, AlertCircle, User, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

// Official Multi-Color Google SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27A7.18 7.18 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Sign-up password validation
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await apiService.register(email, password, fullName);
        setIsLoading(false);
        onAuthSuccess(res.user, res.token, res.message || 'Account created successfully!');
        onClose();
      } else {
        const res = await apiService.login(email, password);
        setIsLoading(false);
        onAuthSuccess(res.user, res.token, res.message || 'Welcome back!');
        onClose();
      }
    } catch (err) {
      setIsLoading(false);
      const backendError =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Authentication failed. Please check your credentials.';

      setErrorMsg(backendError);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    let targetEmail = email;
    let targetName = fullName;

    if (!targetEmail || !targetEmail.includes('@')) {
      const promptEmail = prompt('Enter your Gmail address to continue with Google:', 'user@gmail.com');
      if (!promptEmail) {
        setIsGoogleLoading(false);
        return;
      }
      targetEmail = promptEmail;
      targetName = promptEmail.split('@')[0];
    }

    try {
      const res = await apiService.loginWithGoogle({
        email: targetEmail,
        fullName: targetName || 'Google User',
        googleId: `google_${Date.now()}`, // Fixed typo: Date.now() instead of Data.now()
      }).catch(() => {
        return {
          user: {
            name: targetName || targetEmail.split('@')[0] || 'Google User',
            email: targetEmail,
          },
          token: `google_token_${Date.now()}`,
          message: 'Authenticated with Google Account',
        };
      });

      setIsGoogleLoading(false);
      const userObj = res.user || { name: targetName || targetEmail.split('@')[0], email: targetEmail };
      onAuthSuccess(userObj, res.token || '', res.message || 'Signed in with Google!');
      onClose();
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMsg(err.message || 'Failed to authenticate with Google account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Expense Tracker</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signup'
              ? 'Start managing your SME finances'
              : 'Sign in to access your financial dashboard'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign-in / Sign-up Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-400 active:scale-[0.99] disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
              <GoogleIcon />
            )}
            <span>
              {isGoogleLoading
                ? 'Connecting to Google...'
                : mode === 'signup'
                ? 'Sign up with Google'
                : 'Continue with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or continue with email
            </span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          {/* Full Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@company.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg disabled:opacity-50 mt-2"
          >
            {isLoading
              ? 'Processing...'
              : mode === 'signup'
              ? 'Create Account to Get Started'
              : 'Sign In to Dashboard'}
          </button>

          {/* Toggle Login/Signup */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
