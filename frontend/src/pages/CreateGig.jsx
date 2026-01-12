import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/slices/gigSlice';
import { toast } from 'react-toastify';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.gigs);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.budget <= 0) {
      toast.error('Budget must be a positive number');
      return;
    }

    try {
      await dispatch(createGig(formData)).unwrap();
      toast.success('Gig created successfully!');
      navigate('/my-gigs');
    } catch (err) {
      toast.error(err || 'Failed to create gig');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border-2 border-purple-500/30 animate-scale-in hover:shadow-purple-500/50 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <span className="text-5xl">🎯</span>
            </div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              Post a New Gig
            </h1>
            <p className="text-purple-200 text-lg">Find the perfect freelancer for your project 💫</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <label htmlFor="title" className="block text-sm font-bold text-purple-200 mb-2">
                Gig Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-5 py-3 bg-slate-700/50 border-2 border-purple-500/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-400 placeholder-purple-300"
                placeholder="e.g., Build a responsive landing page"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <label htmlFor="description" className="block text-sm font-bold text-purple-200 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="6"
                className="w-full px-5 py-3 bg-slate-700/50 border-2 border-purple-500/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-400 resize-none placeholder-purple-300"
                placeholder="Describe your project requirements in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <label htmlFor="budget" className="block text-sm font-bold text-purple-200 mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                required
                min="1"
                className="w-full px-5 py-3 bg-slate-700/50 border-2 border-purple-500/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-400 placeholder-purple-300"
                placeholder="e.g., 500"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-purple-500/50"
              >
                {isLoading ? '✨ Creating...' : '🚀 Post Gig'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-4 bg-slate-700 text-purple-200 rounded-xl hover:bg-slate-600 hover:scale-105 transition-all duration-300 font-semibold border-2 border-purple-500/30 hover:border-purple-500/50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
