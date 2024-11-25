import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';

const MemeStack = ({ memes, onMemeChange }) => {
  // Keep track of current and next meme
  const [currentMeme, setCurrentMeme] = React.useState(null);
  const [nextMeme, setNextMeme] = React.useState(null);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Function to select a random meme based on weight
  const getWeightedRandomMeme = () => {
    // Calculate total weight
    const totalWeight = memes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
    
    // Generate a random number between 0 and total weight
    let random = Math.random() * totalWeight;
    
    // Find the meme that corresponds to this random value
    for (const meme of memes) {
      random -= (meme.weight || 1);
      if (random <= 0) {
        return meme;
      }
    }
    
    // Fallback to first meme (shouldn't happen unless array is empty)
    return memes[0];
  };

  // Initialize current and next memes
  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      const firstMeme = getWeightedRandomMeme();
      setCurrentMeme(firstMeme);
      onMemeChange(firstMeme);
      
      const secondMeme = getWeightedRandomMeme();
      setNextMeme(secondMeme);
    }
  }, [memes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSwipe = (direction) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setLastSwipe(direction);

      // Move to next meme and select new next meme
      setCurrentMeme(nextMeme);
      onMemeChange(nextMeme);
      setNextMeme(getWeightedRandomMeme());

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
        {currentMeme && (
          <motion.div
            key={currentMeme.id + "-current"}
            className="absolute inset-0 z-20"
            initial={{ scale: 0.95, y: 8, opacity: 0.8 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
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
              meme={currentMeme}
              onSwipe={handleSwipe}
              isTop={true}
            />
          </motion.div>
        )}
        
        {nextMeme && (
          <motion.div
            key={nextMeme.id + "-next"}
            className="absolute inset-0 z-10"
            initial={{ scale: 0.95, y: 8 }}
            animate={{ scale: 0.95, y: 8 }}
          >
            <MemeCard
              meme={nextMeme}
              onSwipe={() => {}}
              isTop={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemeStack;