import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBids } from '../store/slices/bidSlice';
import { Link } from 'react-router-dom';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(getMyBids());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 animate-fade-in">My Submitted Bids</h1>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
            <p className="mt-4 text-purple-200 text-lg">Loading your bids...</p>
          </div>
        ) : myBids.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-purple-200 text-xl font-medium mb-4">You haven't submitted any bids yet</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
            >
              🔍 Browse Open Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myBids.map((bid, index) => (
              <div 
                key={bid._id} 
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border-2 border-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 animate-slide-up hover:-translate-y-2 hover:rotate-1 relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {bid.gig?.title}
                    </h3>
                    <p className="text-sm text-purple-300 mb-3">
                      💰 Gig Budget: <span className="font-bold text-purple-200">${bid.gig?.budget}</span>
                    </p>
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${
                        bid.gig?.status === 'open'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200'
                      }`}
                    >
                      Gig: {bid.gig?.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">${bid.price}</p>
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${
                        bid.status === 'hired'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : bid.status === 'rejected'
                          ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                          : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-purple-500/30 pt-6">
                  <h4 className="font-bold text-purple-300 mb-3">📝 Your Proposal:</h4>
                  <p className="text-purple-200 mb-6 leading-relaxed">{bid.message}</p>
                  <Link
                    to={`/gigs/${bid.gig?._id}`}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
                  >
                    View Gig Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
