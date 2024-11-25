import React from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const QuickStatIcon = ({ children, count, text }) => (
  <div className="flex items-center gap-2">
    <span className="text-xl">{children}</span>
    <div className="flex flex-col">
      <span className="text-gray-200 font-medium">{count}</span>
      <span className="text-xs text-gray-400">{text}</span>
    </div>
  </div>
);

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

    if (yValue < -50) {
      onSwipe('super');
      return;
    }

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
      <div className="card rounded-xl overflow-hidden shadow-xl relative">
        <img
          src={meme.content}
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
        />
          
        {/* Enhanced Swipe Indicators */}
        <AnimatePresence>
          {isTop && (
            <>
              {getSwipeDirection() === 'right' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 50 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-green-500/80 backdrop-blur-sm px-8 py-4 rounded-2xl border-4 border-white shadow-lg transform rotate-12">
                    <div className="text-4xl font-bold text-white flex items-center gap-3">
                      <span>LIKE</span>
                      <span className="text-5xl">👍</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {getSwipeDirection() === 'left' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-red-500/80 backdrop-blur-sm px-8 py-4 rounded-2xl border-4 border-white shadow-lg transform -rotate-12">
                    <div className="text-4xl font-bold text-white flex items-center gap-3">
                      <span>NOPE</span>
                      <span className="text-5xl">👎</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {getSwipeDirection() === 'super' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -50 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-blue-500/80 backdrop-blur-sm px-8 py-4 rounded-2xl border-4 border-white shadow-lg">
                    <div className="text-4xl font-bold text-white flex items-center gap-3">
                      <span>SUPER</span>
                      <span className="text-5xl">⭐</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <div className="bg-gradient-to-b from-[#2c2d31] to-[#1a1b1e] border-t border-[#3c3d41]/30 p-4">
          <div className="flex justify-between items-center">
            <QuickStatIcon count={meme.likes || 0} text="Likes">
              👍
            </QuickStatIcon>
            
            <QuickStatIcon count={meme.superLikes || 0} text="Super Likes">
              ⭐
            </QuickStatIcon>
            
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="text-green-400 font-medium">New</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;