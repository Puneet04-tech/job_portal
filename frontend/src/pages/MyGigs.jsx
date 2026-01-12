import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyGigs, deleteGig } from '../store/slices/gigSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(getMyGigs());
  }, [dispatch]);

  const handleDelete = async (gigId, gigTitle) => {
    if (window.confirm(`Are you sure you want to delete "${gigTitle}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteGig(gigId)).unwrap();
        toast.success('Gig deleted successfully!');
      } catch (error) {
        toast.error(error || 'Failed to delete gig');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">My Posted Gigs</h1>
          <Link
            to="/create-gig"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
          >
            🚀 Post New Gig
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
            <p className="mt-4 text-purple-200 text-lg">Loading your gigs...</p>
          </div>
        ) : myGigs.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-purple-200 text-xl font-medium">You haven't posted any gigs yet</p>
            <p className="text-purple-300 mt-2">Start by posting your first gig!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {myGigs.map((gig, index) => (
              <div
                key={gig._id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-3 hover:rotate-1 animate-scale-in border-2 border-purple-500/30 group backdrop-blur-xl relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white flex-1 group-hover:text-purple-400 transition-colors duration-300">{gig.title}</h3>
                  <span
                    className={`ml-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${
                      gig.status === 'open'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200'
                    }`}
                  >
                    {gig.status}
                  </span>
                </div>
                <p className="text-purple-200 mb-6 line-clamp-3 leading-relaxed">{gig.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">${gig.budget}</span>
                </div>
                <div className="flex gap-3 relative z-10">
                  <Link
                    to={`/gigs/${gig._id}`}
                    className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 hover:rotate-1 transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
                  >
                    <span className="inline-flex items-center gap-2">
                      View & Manage
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDelete(gig._id, gig.title)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:scale-110 hover:rotate-3 transition-all duration-300 font-bold shadow-lg hover:shadow-red-500/50"
                    title="Delete Gig"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
