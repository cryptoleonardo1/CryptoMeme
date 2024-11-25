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

  const SwipeIndicator = ({ type }) => {
    const config = {
      right: {
        color: 'rgb(34 197 94)',
        text: 'LIKE',
        emoji: '👍',
        rotation: '12deg',
        initialX: -100,
        exitX: 100,
      },
      left: {
        color: 'rgb(239 68 68)',
        text: 'NOPE',
        emoji: '👎',
        rotation: '-12deg',
        initialX: 100,
        exitX: -100,
      },
      super: {
        color: 'rgb(59 130 246)',
        text: 'SUPER',
        emoji: '⭐',
        rotation: '0deg',
        initialY: 100,
        exitY: -100,
      },
    };

    const { color, text, emoji, rotation, initialX, exitX, initialY, exitY } = config[type];

    return (
      <motion.div
        initial={{ 
          opacity: 0, 
          scale: 0.5, 
          x: initialX || 0, 
          y: initialY || 0 
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          x: 0, 
          y: 0 
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.5, 
          x: exitX || 0, 
          y: exitY || 0 
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="px-12 py-8 rounded-3xl shadow-2xl border-8 flex items-center justify-center transform"
          style={{
            backgroundColor: `${color}dd`,
            borderColor: 'white',
            transform: `rotate(${rotation}) scale(1.2)`,
            boxShadow: `0 25px 50px -12px ${color}66`,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-8xl">{emoji}</span>
            <span className="text-6xl font-bold text-white tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              {text}
            </span>
          </div>
        </div>
      </motion.div>
    );
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
          
        {/* Swipe Indicators */}
        <AnimatePresence>
          {isTop && getSwipeDirection() && (
            <SwipeIndicator type={getSwipeDirection()} />
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
              <span className="text-green-400 font-medium">Hot</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;