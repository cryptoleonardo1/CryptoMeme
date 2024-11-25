import React from 'react';
import MemeCard from '../MemeCard/MemeCard';

const MemeStack = ({ memes, onMemeChange }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (memes[currentIndex]) {
      onMemeChange(memes[currentIndex]);
    }
  }, [currentIndex, memes, onMemeChange]);

  const handleSwipe = (direction) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setLastSwipe(direction);

      // Immediately update to next card
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        if (newIndex < memes.length) {
          onMemeChange(memes[newIndex]);
        }
        return newIndex;
      });

      // Clear the swipe indicator after a delay
      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 800); // Duration for showing the indicator
    }
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      {/* Swipe Indicator */}
      {lastSwipe && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div 
            className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl transform transition-all duration-200 ${
              lastSwipe === 'right' ? 'bg-green-500/90 rotate-12' :
              lastSwipe === 'left' ? 'bg-red-500/90 -rotate-12' :
              'bg-blue-500/90'
            }`}
          >
            {lastSwipe === 'right' && (
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <span>LIKE</span>
                <span className="text-5xl">👍</span>
              </div>
            )}
            {lastSwipe === 'left' && (
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <span>NOPE</span>
                <span className="text-5xl">👎</span>
              </div>
            )}
            {lastSwipe === 'super' && (
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <span>SUPER</span>
                <span className="text-5xl">⭐</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cards */}
      {memes.map((meme, index) => {
        if (index < currentIndex) return null;
        if (index > currentIndex + 1) return null;
        
        const isTop = index === currentIndex;
        
        return (
          <div
            key={meme.id}
            className={`absolute inset-0 ${isTop ? 'z-20' : 'z-10'}`}
            style={{
              transform: `scale(${isTop ? 1 : 0.95}) translateY(${isTop ? 0 : 8}px)`,
              opacity: isTop ? 1 : 0.8,
              transition: 'all 0.3s ease-out',
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