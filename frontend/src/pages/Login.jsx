import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-20"></div>
      
      <div className="max-w-md w-full space-y-8 bg-slate-800/50 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border-2 border-purple-500/30 relative z-10 animate-scale-in">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            <span className="text-pink-400">✦</span> Welcome Back
          </h2>
          <p className="text-center text-purple-200 text-lg mb-1">
            Sign in to <span className="font-bold text-pink-400">GigFlow</span>
          </p>
          <p className="mt-4 text-center text-sm text-purple-300">
            Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-pink-400 hover:text-pink-300 transition-colors hover:underline">
              Create one →
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-purple-500/30 bg-slate-700/50 placeholder-purple-300 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-purple-500/30 bg-slate-700/50 placeholder-purple-300 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border-2 border-purple-400/30 text-base font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:rotate-1 shadow-xl hover:shadow-purple-500/50"
            >
              <span className="inline-flex items-center gap-2">
                {isLoading ? '✨ Signing in...' : '🚀 Sign In'}
                {!isLoading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
