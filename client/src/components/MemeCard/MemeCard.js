import React from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const MemeCard = ({ meme, onSwipe, isTop }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(x, [-100, -50, 0, 50, 100], [0, 1, 1, 1, 0]);
  const scale = useTransform(y, [-50, 0, 50], [0.9, 1, 0.9]);

  // Get current swipe direction for displaying the right indicator
  const getSwipeDirection = () => {
    const xValue = x.get();
    const yValue = y.get();

    if (yValue < -50) return 'super';
    if (xValue > 50) return 'right';
    if (xValue < -50) return 'left';
    return null;
  };
  
  const handleDragEnd = async (event, info) => {
    const xValue = x.get();
    const yValue = y.get();

    // Handle swipe up for super like
    if (yValue < -50) {
      onSwipe('super');
      return;
    }

    // Handle left/right swipes
    if (Math.abs(xValue) > 50) {
      if (xValue > 0) {
        onSwipe('right');
      } else {
        onSwipe('left');
      }
    }
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate, opacity, scale }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="card bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="relative">
          <img
            src={meme.content}
            alt={meme.projectName}
            className="w-full aspect-square object-cover"
          />
          
          {/* Swipe Indicators */}
          <AnimatePresence>
            {isTop && (
              <>
                {getSwipeDirection() === 'right' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg rotate-12"
                  >
                    LIKE
                  </motion.div>
                )}
                {getSwipeDirection() === 'left' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg -rotate-12"
                  >
                    NOPE
                  </motion.div>
                )}
                {getSwipeDirection() === 'super' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
                  >
                    SUPER LIKE
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Quick Stats */}
        <div className="p-6 bg-silver">
          <div className="flex justify-between text-sm text-gray-600">
            <span>👍 {meme.likes || 0}</span>
            <span>⭐ {meme.score || 0} points</span>
            <span>🔥 {meme.trending ? 'Trending' : 'New'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;