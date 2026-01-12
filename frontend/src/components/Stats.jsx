import { useState, useEffect, useRef } from 'react';

import { memo } from 'react';

// Simplified static counter for better performance
const StatCounter = ({ end, suffix = '', prefix = '' }) => {
  return (
    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
      {prefix}{end.toLocaleString()}{suffix}
    </span>
  );
};

const Stats = memo(() => {
  const stats = [
    { icon: '💼', label: 'Active Gigs', value: 1500, suffix: '+' },
    { icon: '👥', label: 'Happy Users', value: 5000, suffix: '+' },
    { icon: '✅', label: 'Projects Completed', value: 3200, suffix: '+' },
    { icon: '⭐', label: 'Average Rating', value: 4.8, suffix: '/5' },
  ];

  return (
    <div className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
            Why Choose GigFlow? 🚀
          </h2>
          <p className="text-xl text-purple-200">Join thousands of satisfied clients and freelancers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-3 hover:rotate-2 shadow-xl hover:shadow-purple-500/50 animate-scale-in group relative overflow-hidden will-change-transform"
              style={{ animationDelay: `${index * 0.1}s`, transform: 'translate3d(0,0,0)' }}
            >
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-4 will-change-transform" style={{transform: 'translate3d(0,0,0)'}}>{stat.icon}</div>
                <StatCounter end={stat.value} suffix={stat.suffix} />
                <p className="text-purple-200 font-semibold mt-3 text-lg">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Stats;
