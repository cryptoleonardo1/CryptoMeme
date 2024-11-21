import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MemeCard = ({ meme, onSwipe, isTop }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = async () => {
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
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="card bg-white rounded-xl overflow-hidden shadow-xl">
        <img 
          src={meme.content} 
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold">{meme.projectName}</h2>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{meme.projectDetails.network}</span>
            <div className="flex items-center">
              <span className={`${meme.projectDetails.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {meme.projectDetails.priceChange24h > 0 ? '+' : ''}{meme.projectDetails.priceChange24h}%
              </span>
              <span className="ml-2">{meme.projectDetails.marketCap}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;