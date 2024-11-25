import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        if (newIndex < memes.length) {
          onMemeChange(memes[newIndex]);
        }
        return newIndex;
      });

      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 800);
    }
  };

  // Animation variants for the swipe indicator
  const indicatorVariants = {
    initial: {
      opacity: 0,
      scale: 0.5,
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      {/* Swipe Indicator with enhanced animations */}
      <AnimatePresence>
        {lastSwipe && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            variants={indicatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div 
              className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl backdrop-blur-sm ${
                lastSwipe === 'right' ? 'bg-green-500/90' :
                lastSwipe === 'left' ? 'bg-red-500/90' :
                'bg-blue-500/90'
              }`}
              animate={{
                rotate: lastSwipe === 'right' ? 12 : lastSwipe === 'left' ? -12 : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                scale: {
                  duration: 0.2,
                  times: [0, 0.5, 1]
                }
              }}
            >
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {lastSwipe === 'right' ? 'LIKE' : lastSwipe === 'left' ? 'NOPE' : 'SUPER'}
                </motion.span>
                <motion.span 
                  className="text-5xl"
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {lastSwipe === 'right' ? '👍' : lastSwipe === 'left' ? '👎' : '⭐'}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <AnimatePresence>
        {memes.map((meme, index) => {
          if (index < currentIndex) return null;
          if (index > currentIndex + 1) return null;
          
          const isTop = index === currentIndex;
          
          return (
            <motion.div
              key={meme.id}
              className={`absolute inset-0 ${isTop ? 'z-20' : 'z-10'}`}
              initial={isTop ? { scale: 0.95, y: 8, opacity: 0.8 } : { scale: 0.95, y: 8 }}
              animate={isTop ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.95, y: 8 }}
              exit={{ 
                x: lastSwipe === 'right' ? 1000 : lastSwipe === 'left' ? -1000 : 0,
                y: lastSwipe === 'super' ? -1000 : 0,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <MemeCard
                meme={meme}
                onSwipe={handleSwipe}
                isTop={isTop}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {currentIndex >= memes.length && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
      )}
    </div>
  );
};

export default MemeStack;