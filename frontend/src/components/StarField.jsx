import { memo } from 'react';

const StarField = memo(() => {
  // Generate random stars - reduced to 5 for optimal performance
  const stars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-0.5 h-0.5'
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute ${star.size} bg-white rounded-full animate-pulse will-change-opacity`}
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
            opacity: 0.6,
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      ))}
    </div>
  );
});

export default StarField;
