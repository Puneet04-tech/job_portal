import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGigById, clearCurrentGig } from '../store/slices/gigSlice';
import { createBid, getBidsForGig, hireBid, clearSuccess } from '../store/slices/bidSlice';
import { toast } from 'react-toastify';

const GigDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentGig, isLoading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, isLoading: bidLoading, successMessage } = useSelector((state) => state.bids);
  const { user } = useSelector((state) => state.auth);

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    message: '',
    price: '',
  });

  useEffect(() => {
    dispatch(getGigById(id));
    return () => {
      dispatch(clearCurrentGig());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentGig && user && currentGig.owner?._id === user._id) {
      dispatch(getBidsForGig(id));
    }
  }, [currentGig, user, dispatch, id]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      setShowBidForm(false);
      setBidData({ message: '', price: '' });
    }
  }, [successMessage, dispatch]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!bidData.message || !bidData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (bidData.price <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    try {
      await dispatch(createBid({ gigId: id, ...bidData })).unwrap();
      toast.success('Bid submitted successfully!');
      setShowBidForm(false);
      setBidData({ message: '', price: '' });
    } catch (err) {
      toast.error(err || 'Failed to submit bid');
    }
  };

  const handleHire = async (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      try {
        await dispatch(hireBid(bidId)).unwrap();
        dispatch(getGigById(id));
      } catch (err) {
        toast.error(err || 'Failed to hire freelancer');
      }
    }
  };

  const isOwner = user && currentGig?.owner?._id === user._id;
  const canBid = user && !isOwner && currentGig?.status === 'open';

  if (gigLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Gig not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 hover:-translate-x-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/50 inline-flex items-center gap-2"
      >
        <span className="text-xl">←</span> Back to Gigs
      </button>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-10 border-2 border-purple-500/30 backdrop-blur-xl animate-scale-in relative overflow-hidden group">
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="mb-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{currentGig.title}</h1>
            <span
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg animate-pulse ${
                currentGig.status === 'open'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 text-purple-200'
              }`}
            >
              {currentGig.status.toUpperCase()}
            </span>
          </div>
          
          <p className="text-purple-100 text-lg mb-6 whitespace-pre-wrap leading-relaxed">{currentGig.description}</p>
          
          <div className="flex justify-between items-center mb-6 bg-slate-700/50 rounded-2xl p-6 border border-purple-500/20">
            <div>
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">${currentGig.budget}</span>
              <span className="text-purple-300 ml-3 text-lg">Budget</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-300">Posted by</p>
              <p className="text-2xl font-bold text-white">{currentGig.owner?.name}</p>
            </div>
          </div>
        </div>

        {/* Bid Form for Freelancers */}
        {canBid && !showBidForm && (
          <div className="relative z-10">
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 hover:rotate-1 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-purple-500/50"
            >
              💼 Submit a Bid
            </button>
          </div>
        )}

        {canBid && showBidForm && (
          <div className="border-t-2 border-purple-500/30 pt-6 relative z-10">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">📝 Submit Your Bid</h3>
            <form onSubmit={handleBidSubmit} className="space-y-6">
              <div className="animate-slide-up">
                <label className="block text-sm font-bold text-purple-200 mb-3">
                  Your Proposal
                </label>
                <textarea
                  rows="5"
                  className="w-full px-5 py-4 border-2 border-purple-500/30 bg-slate-700/50 text-white placeholder-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Explain why you're the best fit for this project..."
                  value={bidData.message}
                  onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                  required
                />
              </div>
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <label className="block text-sm font-bold text-purple-200 mb-3">
                  Your Price ($)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-5 py-4 border-2 border-purple-500/30 bg-slate-700/50 text-white placeholder-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your bid amount"
                  value={bidData.price}
                  onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <button
                  type="submit"
                  disabled={bidLoading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
                >
                  {bidLoading ? '✨ Submitting...' : '🚀 Submit Bid'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBidForm(false)}
                  className="px-8 py-4 bg-slate-700 text-purple-200 rounded-xl hover:bg-slate-600 hover:scale-105 transition-all duration-300 font-semibold border-2 border-purple-500/30 hover:border-purple-500/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bids List for Owner */}
        {isOwner && (
          <div className="border-t-2 border-purple-500/30 pt-8 mt-8 relative z-10">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
              💼 Bids Received ({bids.length})
            </h3>
            {bids.length === 0 ? (
              <p className="text-purple-300 text-center py-8 text-lg">No bids yet 📭</p>
            ) : (
              <div className="space-y-6">
                {bids.map((bid, index) => (
                  <div
                    key={bid._id}
                    className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-scale-in group relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Animated gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <p className="font-bold text-2xl text-white mb-1">👤 {bid.freelancer?.name}</p>
                        <p className="text-sm text-purple-300">✉️ {bid.freelancer?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">${bid.price}</p>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg mt-2 ${
                            bid.status === 'hired'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse'
                              : bid.status === 'rejected'
                              ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          }`}
                        >
                          {bid.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-purple-100 mb-4 text-base leading-relaxed relative z-10">💬 {bid.message}</p>
                    {bid.status === 'pending' && currentGig.status === 'open' && (
                      <button
                        onClick={() => handleHire(bid._id)}
                        disabled={bidLoading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:scale-105 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-green-500/50 relative z-10"
                      >
                        {bidLoading ? '✨ Hiring...' : '🎯 Hire This Freelancer'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default GigDetail;
