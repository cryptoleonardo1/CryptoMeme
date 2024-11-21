import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MemeCard = ({ meme, onSwipe, isTop, onSwipeDown }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = async (event, info) => {
    if (info.offset.y > 100) {
      onSwipeDown();
      return;
    }
    
    const xValue = x.get();
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
      style={{ x, rotate, opacity }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="card bg-white rounded-xl overflow-hidden shadow-xl">
        <img 
          src={meme.content} 
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
        />
      </div>
    </motion.div>
  );
};

export default MemeCard;