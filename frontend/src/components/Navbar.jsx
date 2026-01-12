import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl relative overflow-hidden border-b-2 border-purple-500/30 sticky top-0 z-50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold flex items-center space-x-2 hover:scale-110 transition-transform duration-300 group">
                <span className="text-pink-400 animate-spin-slow">✦</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GigFlow</span>
                <span className="text-purple-400 group-hover:rotate-12 transition-transform">✨</span>
              </h1>
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-purple-200 hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-pink-800/50 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 border-2 border-transparent hover:border-purple-400/30"
                >
                  🏠 Browse Gigs
                </Link>
                <Link
                  to="/create-gig"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-purple-200 hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-pink-800/50 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 border-2 border-transparent hover:border-purple-400/30"
                >
                  ✍️ Post a Gig
                </Link>
                <Link
                  to="/my-gigs"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-purple-200 hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-pink-800/50 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 border-2 border-transparent hover:border-purple-400/30"
                >
                  💼 My Gigs
                </Link>
                <Link
                  to="/my-bids"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-purple-200 hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-pink-800/50 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 border-2 border-transparent hover:border-purple-400/30"
                >
                  📋 My Bids
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-pink-400 font-semibold animate-fade-in px-4 py-2 bg-purple-800/30 rounded-xl border border-purple-400/30">👋 Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all duration-300 hover:scale-110 hover:rotate-2 shadow-lg border-2 border-red-500/30 hover:shadow-red-500/50"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl text-sm font-bold text-purple-200 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 bg-purple-800/30 hover:bg-purple-700/50 border-2 border-purple-400/30"
                >
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110 hover:rotate-2 shadow-lg hover:shadow-purple-500/50 border-2 border-purple-400/30"
                >
                  🎉 Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
