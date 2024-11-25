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

const MemeCard = ({ meme, onSwipe, isTop, swipeDirection }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_, info) => {
    const xValue = x.get();
    const yValue = y.get();
    
    if (yValue < -100) {
      y.set(-1000);
      onSwipe('super');
    } else if (xValue > 100) {
      x.set(1000);
      onSwipe('right');
    } else if (xValue < -100) {
      x.set(-1000);
      onSwipe('left');
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const SwipeIndicator = ({ type }) => {
    const variants = {
      initial: { opacity: 0, scale: 0.5 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.2
        }
      },
      exit: { 
        opacity: 0,
        scale: 0.5,
        transition: {
          duration: 0.2
        }
      }
    };

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

    const { color, text, emoji, rotation } = config[type];

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
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

  // Calculate swipe direction based on motion values
  const getSwipeDirection = () => {
    const xValue = x.get();
    const yValue = y.get();

    if (yValue < -50) return 'super';
    if (xValue > 50) return 'right';
    if (xValue < -50) return 'left';
    return null;
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ 
        x, 
        y, 
        rotate, 
        opacity
      }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={1}
      transition={{ type: "spring", damping: 50, stiffness: 500 }}
    >
      <div className="card rounded-xl overflow-hidden shadow-xl relative">
        <img
          src={meme.content}
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
        />

        <AnimatePresence>
          {isTop && getSwipeDirection() && (
            <SwipeIndicator type={getSwipeDirection()} />
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