import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';

const MemeStack = ({ memes, onMemeChange }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (memes[currentIndex]) {
      onMemeChange(memes[currentIndex]);
    }
  }, [currentIndex, memes, onMemeChange]);

  const handleSwipe = (direction) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setSwipeDirection(direction);

      // Delay for the swipe animation
      setTimeout(() => {
        setCurrentIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          if (newIndex < memes.length) {
            onMemeChange(memes[newIndex]);
          }
          return newIndex;
        });
        
        // Additional delay before resetting the animation state
        setTimeout(() => {
          setSwipeDirection(null);
          setIsAnimating(false);
        }, 300);
      }, 300);
    }
  };

  // Separate component for the swipe indicator overlay
  const SwipeOverlay = ({ direction }) => {
    const config = {
      right: {
        color: 'rgb(34 197 94)',
        text: 'LIKE',
        emoji: '👍',
        rotation: 12
      },
      left: {
        color: 'rgb(239 68 68)',
        text: 'NOPE',
        emoji: '👎',
        rotation: -12
      },
      super: {
        color: 'rgb(59 130 246)',
        text: 'SUPER',
        emoji: '⭐',
        rotation: 0
      }
    };

    const { color, text, emoji, rotation } = config[direction];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <div
          className="px-12 py-8 rounded-2xl border-8 flex flex-col items-center gap-4"
          style={{
            backgroundColor: `${color}dd`,
            borderColor: 'white',
            transform: `rotate(${rotation}deg) scale(1.2)`,
            boxShadow: `0 25px 50px -12px ${color}66`,
          }}
        >
          <span className="text-8xl">{emoji}</span>
          <span className="text-6xl font-bold text-white tracking-wider">
            {text}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      {/* Swipe indicator overlay */}
      <AnimatePresence>
        {swipeDirection && <SwipeOverlay direction={swipeDirection} />}
      </AnimatePresence>

      {/* Cards */}
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
              transition: 'all 0.3s ease-out',
            }}
          >
            <MemeCard
              meme={meme}
              onSwipe={handleSwipe}
              isTop={isTop}
              swipeDirection={swipeDirection}
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