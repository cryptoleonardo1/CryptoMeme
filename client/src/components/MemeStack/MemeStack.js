// MemeStack.js
import React from 'react';
import MemeCard from '../MemeCard/MemeCard';

const MemeStack = ({ memes, onMemeChange }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [lastDirection, setLastDirection] = React.useState(null);

  // Update current meme whenever index changes
  React.useEffect(() => {
    if (memes[currentIndex]) {
      onMemeChange(memes[currentIndex]);
    }
  }, [currentIndex, memes, onMemeChange]);

  const handleSwipe = (direction) => {
    setLastDirection(direction);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      // Update current meme if within bounds
      if (newIndex < memes.length) {
        onMemeChange(memes[newIndex]);
      }
      return newIndex;
    });
    
    setTimeout(() => {
      setLastDirection(null);
    }, 1000);
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
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
            className={`absolute inset-0 ${isTop ? 'z-10' : 'z-0'}`}
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
              onClick={() => {
                setCurrentIndex(0);
                onMemeChange(memes[0]);
              }}
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