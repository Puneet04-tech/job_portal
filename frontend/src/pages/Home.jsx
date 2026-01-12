import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGigs } from '../store/slices/gigSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Marquee from '../components/Marquee';
import ScrollToTop from '../components/ScrollToTop';
import StarField from '../components/StarField';
import Stats from '../components/Stats';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { gigs, isLoading } = useSelector((state) => state.gigs);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getGigs(searchQuery));
  }, [dispatch, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getGigs(searchQuery));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Star Field Background */}
      <StarField />
      
      {/* Marquee Banner */}
      <Marquee />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-6xl">🚀</span>
          </div>
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4 drop-shadow-lg">
            Discover Amazing Opportunities
          </h1>
          <p className="text-xl text-purple-200 animate-slide-up" style={{animationDelay: '0.2s'}}>Find the perfect gig for your skills ✨</p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12 max-w-3xl mx-auto animate-slide-up group" style={{animationDelay: '0.3s'}}>
          <div className="flex gap-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-3 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-purple-500/30">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              <input
                type="text"
                placeholder="Search gigs by title or description..."
                className="w-full pl-14 pr-6 py-4 rounded-xl focus:outline-none bg-slate-700/50 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 border-2 border-transparent hover:border-purple-500/30 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 hover:rotate-2 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50 inline-flex items-center gap-2 group-hover:gap-3"
            >
              Search
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="relative inline-block">
              {/* Outer spinning ring */}
              <div className="w-24 h-24 border-4 border-purple-200/20 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="w-24 h-24 border-4 border-transparent border-b-purple-600 border-l-pink-600 rounded-full animate-spin absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
              
              {/* Center sparkle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-pulse">✨</span>
              </div>
            </div>
            
            <p className="mt-6 text-purple-200 text-xl font-bold animate-pulse">Loading amazing gigs...</p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            </div>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-purple-200 text-xl font-medium">No open gigs found</p>
            <p className="text-purple-300 mt-2">Try a different search or check back later</p>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <Stats />
            
            {/* Gigs Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {gigs.map((gig, index) => (
              <div
                key={gig._id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-3 hover:rotate-1 animate-scale-in border-2 border-purple-500/30 group backdrop-blur-xl relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                    Open
                  </span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">
                    ${gig.budget}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                  {gig.title}
                </h3>
                
                <p className="text-purple-200 mb-6 line-clamp-3 leading-relaxed">
                  {gig.description}
                </p>
                
                <div className="flex items-center mb-6 text-sm text-purple-300">
                  <span className="inline-flex items-center">
                    <span className="mr-2">👤</span>
                    {gig.owner?.name}
                  </span>
                </div>
                
                <Link
                  to={`/gigs/${gig._id}`}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-110 hover:rotate-2 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50 relative z-10"
                >
                  <span className="inline-flex items-center gap-2">
                    View Details
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                </Link>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
