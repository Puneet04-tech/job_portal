const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 will-change-opacity" style={{transform: 'translate3d(0,0,0)'}}></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 will-change-opacity" style={{transform: 'translate3d(0,0,0)'}}></div>
      
      <div className="relative z-10">
        {/* Spinning Logo */}
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-purple-200/20 rounded-full`}></div>
          <div className={`${sizeClasses[size]} border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin absolute top-0 left-0`}></div>
          <div className={`${sizeClasses[size]} border-4 border-transparent border-b-purple-600 border-l-pink-600 rounded-full animate-spin absolute top-0 left-0`} style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-pulse">✨</span>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-6 text-center">
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">
            {text}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
