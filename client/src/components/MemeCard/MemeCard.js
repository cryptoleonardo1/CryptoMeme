import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const MemeCard = ({ meme, onSwipe, isTop, onSwipeDown, onSuperLike }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(y, [-100, 0, 100], [0.9, 1, 0.9]);
  const [isPressed, setIsPressed] = useState(false);

  const handleDragEnd = async (event, info) => {
    const xValue = x.get();
    const yValue = y.get();
    
    setIsPressed(false);

    // Handle swipe down for details
    if (yValue > 100) {
      onSwipeDown();
      return;
    }

    // Handle swipe up for super like
    if (yValue < -100) {
      onSuperLike();
      return;
    }

    // Handle left/right swipes
    if (Math.abs(xValue) > 100) {
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
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsPressed(true)}
      whileTap={{ scale: 0.95 }}
    >
      <div className="card bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="relative">
          <img
            src={meme.content}
            alt={meme.projectName}
            className="w-full aspect-square object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white text-xl font-bold">{meme.projectName}</h3>
            {meme.premium && (
              <span className="inline-block bg-yellow-500 text-black text-xs px-2 py-1 rounded-full mt-1">
                Premium
              </span>
            )}
          </div>
          
          {/* Swipe Indicators */}
          <AnimatePresence>
            {isPressed && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-12"
                >
                  LIKE
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-12"
                >
                  NOPE
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  SUPER LIKE
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Quick Stats */}
        <div className="p-4 bg-white">
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