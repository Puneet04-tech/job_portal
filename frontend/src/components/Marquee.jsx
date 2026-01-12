import { memo } from 'react';

// Simplified static banner for better performance
const Marquee = memo(() => {
  const features = [
    "💼 Post Unlimited Gigs",
    "⚡ Real-time Notifications", 
    "🎯 Find Perfect Freelancers",
    "💰 Secure Payments",
    "🚀 Fast Hiring Process",
    "🌟 Top Rated Platform"
  ];

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-3 border-y-2 border-pink-500/30 shadow-lg" role="banner" aria-label="Platform features">
      <div className="flex justify-center flex-wrap gap-4 px-4">
        {features.map((feature, index) => (
          <span
            key={index}
            className="text-white font-bold text-sm md:text-base inline-flex items-center"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
});

export default Marquee;
