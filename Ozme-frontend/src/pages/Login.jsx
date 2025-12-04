import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LuxuryLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
  });
  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Password validation helper
  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    };
    setPasswordValidation(validation);
    return validation.length && validation.uppercase && validation.number;
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      // Signup validation
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters and include one uppercase letter and one number.';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    } else {
      // Login validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          // Navigate to dashboard after successful login
          navigate('/dashboard', { replace: true });
        } else {
          // Show specific error message based on error code
          let errorMessage = result.error || 'Login failed. Please try again or contact support.';
          
          // Handle specific error codes
          if (result.errorCode === 'BACKEND_OFFLINE') {
            errorMessage = 'Unable to connect to the server. Please try again later.';
          } else if (result.errorCode === 'DATABASE_UNAVAILABLE') {
            errorMessage = 'Database is not available. Please try again later.';
          } else if (result.errorCode === 'USER_NOT_FOUND') {
            errorMessage = 'No account found with this email.';
          } else if (result.errorCode === 'WRONG_PASSWORD') {
            errorMessage = 'Incorrect password. Please try again.';
          }
          
          toast.error(errorMessage, { duration: 5000 });
        }
      } else {
        // Signup
        const result = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        });

        if (result.success) {
          // Navigate to dashboard after successful registration
          navigate('/dashboard', { replace: true });
        } else {
          // Show specific error message based on error code
          let errorMessage = result.error || 'Registration failed due to an unexpected issue.';
          
          // Handle specific error codes
          if (result.errorCode === 'BACKEND_OFFLINE') {
            errorMessage = 'Unable to connect to the server. Please try again later.';
          } else if (result.errorCode === 'DATABASE_UNAVAILABLE') {
            errorMessage = 'Database is not available. Please try again later.';
          } else if (result.errorCode === 'USER_EXISTS') {
            errorMessage = 'An account with this email already exists.';
          } else if (result.errorCode === 'PASSWORD_TOO_SHORT') {
            errorMessage = 'Password must be at least 8 characters long.';
          } else if (result.errorCode === 'PASSWORD_NO_UPPERCASE') {
            errorMessage = 'Password must contain at least one uppercase letter.';
          } else if (result.errorCode === 'PASSWORD_NO_NUMBER') {
            errorMessage = 'Password must contain at least one number.';
          }
          
          toast.error(errorMessage, { duration: 5000 });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await googleLogin();
      if (result && result.success) {
        // Navigate to dashboard after successful Google login
        navigate('/dashboard', { replace: true });
      } else if (result && result.error) {
        // Show error message if login failed
        toast.error(result.error || 'Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
    });
    setErrors({});
    setPasswordValidation({
      length: false,
      uppercase: false,
      number: false,
    });
  };

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });
    if (!isLogin) {
      validatePassword(value);
      // Clear confirm password error if passwords match
      if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors({ ...errors, confirmPassword: '' });
      }
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setFormData({ ...formData, confirmPassword: value });
    if (formData.password && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">
            {isLogin ? 'Welcome' : 'Join Us'}
            <span className="block font-serif italic text-amber-300 mt-2">
              {isLogin ? 'Back' : 'Today'}
            </span>
          </h1>

          <p className="text-gray-400 font-light">
            {isLogin ? 'Sign in to continue your fragrance journey' : 'Create your account and discover luxury'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-none border border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="animate-slideDown">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${
                      errors.name ? 'border-red-500' : 'border-white/10'
                    } text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-all duration-300`}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-all duration-300`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border ${
                    errors.password ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-all duration-300`}
                  placeholder="Enter your password"
                  required
                  minLength={isLogin ? 6 : 8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
              {!isLogin && formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-400 mb-2">Password requirements:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.length ? 'text-green-400' : 'text-gray-500'}`}>
                      {passwordValidation.length ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-500" />
                      )}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                      {passwordValidation.uppercase ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-500" />
                      )}
                      One uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordValidation.number ? 'text-green-400' : 'text-gray-500'}`}>
                      {passwordValidation.number ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-500" />
                      )}
                      One number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="animate-slideDown">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                    } text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-all duration-300`}
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="animate-slideDown">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => toast('Password reset feature coming soon!', { icon: '🛠️' })}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-light"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black font-semibold text-sm tracking-[0.2em] uppercase hover:bg-amber-300 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-300/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400 font-light tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full py-4 bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Toggle Login/Signup */}
          <p className="text-center text-sm text-gray-400 mt-8 font-light">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            {' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Decorative Bottom Line */}
        <div className="flex justify-center mt-8">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
