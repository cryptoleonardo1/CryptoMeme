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
  const opacity = useTransform(x, [-100, -50, 0, 50, 100], [1, 1, 1, 1, 1]);

  const getSwipeDirection = () => {
    const xValue = x.get();
    const yValue = y.get();

    if (yValue < -50) return 'super';
    if (xValue > 50) return 'right';
    if (xValue < -50) return 'left';
    return null;
  };

  const handleDragEnd = (_, info) => {
    const xValue = x.get();
    const yValue = y.get();
    
    if (yValue < -50) {
      onSwipe('super');
    } else if (xValue > 100) {
      onSwipe('right');
    } else if (xValue < -100) {
      onSwipe('left');
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate, opacity }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={1}
    >
      <div className="card rounded-xl overflow-hidden shadow-xl relative">
        <img
          src={meme.content}
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
        />

        <AnimatePresence>
          {isTop && (
            <>
              {getSwipeDirection() === 'right' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <div className="bg-green-500/90 px-12 py-8 rounded-2xl border-8 border-white shadow-2xl transform rotate-12">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-8xl">👍</span>
                      <span className="text-6xl font-bold text-white tracking-wider">
                        LIKE
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {getSwipeDirection() === 'left' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <div className="bg-red-500/90 px-12 py-8 rounded-2xl border-8 border-white shadow-2xl transform -rotate-12">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-8xl">👎</span>
                      <span className="text-6xl font-bold text-white tracking-wider">
                        NOPE
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {getSwipeDirection() === 'super' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <div className="bg-blue-500/90 px-12 py-8 rounded-2xl border-8 border-white shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-8xl">⭐</span>
                      <span className="text-6xl font-bold text-white tracking-wider">
                        SUPER
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

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