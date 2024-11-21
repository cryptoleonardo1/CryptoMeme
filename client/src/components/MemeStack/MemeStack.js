import React from 'react';
import MemeCard from '../MemeCard/MemeCard';

const MemeStack = ({ memes }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [lastDirection, setLastDirection] = React.useState(null);

  const handleSwipe = (direction) => {
    setLastDirection(direction);
    setCurrentIndex(prevIndex => prevIndex + 1);
    setTimeout(() => {
      setLastDirection(null);
    }, 1000);
  };

  return (
    <div className="relative max-w-md mx-auto px-4 h-[480px]">
      {/* Direction Indicators */}
      {lastDirection && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          {lastDirection === 'right' && (
            <div className="text-4xl font-bold text-green-500 transform rotate-[-30deg]">
              LIKE
            </div>
          )}
          {lastDirection === 'left' && (
            <div className="text-4xl font-bold text-red-500 transform rotate-[30deg]">
              NOPE
            </div>
          )}
        </div>
      )}
      
      {memes.map((meme, index) => {
        if (index < currentIndex) return null;
        if (index > currentIndex + 1) return null;
        const isTop = index === currentIndex;
        return (
          <div
            key={meme.id}
            className={`absolute w-full ${isTop ? 'z-10' : 'z-0'}`}
            style={{
              transform: `scale(${isTop ? 1 : 0.95}) translateY(${isTop ? 0 : 8}px)`,
              opacity: isTop ? 1 : 0.8,
            }}
          >
            <MemeCard
              meme={meme}
              onSwipe={handleSwipe}
              isTop={isTop}
            />
          </div>
        );
      })}
      
      {currentIndex >= memes.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No more memes!</h3>
            <button
              onClick={() => setCurrentIndex(0)}
              className="btn-primary"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeStack;