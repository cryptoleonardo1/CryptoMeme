import React from 'react';
import MemeCard from '../MemeCard/MemeCard';

const MemeStack = ({ memes, onMemeChange }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // We'll keep lastDirection but use it for transition timing
  const [lastDirection, setLastDirection] = React.useState(null);

  React.useEffect(() => {
    if (memes[currentIndex]) {
      onMemeChange(memes[currentIndex]);
    }
  }, [currentIndex, memes, onMemeChange]);

  const handleSwipe = (direction) => {
    setLastDirection(direction); // This is used to coordinate card transitions
    
    // Delay the index change until after the swipe animation
    setTimeout(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        if (newIndex < memes.length) {
          onMemeChange(memes[newIndex]);
        }
        return newIndex;
      });
    }, 200); // Match this with your swipe animation duration

    // Reset lastDirection after swipe animation completes
    setTimeout(() => {
      setLastDirection(null);
    }, 1000);
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
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
              transition: `all ${lastDirection ? '0.2s' : '0s'} ease-out`,
            }}
          >
            <MemeCard
              meme={meme}
              onSwipe={handleSwipe}
              isTop={isTop}
              key={`${meme.id}-${lastDirection}`} // Force re-render on direction change
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