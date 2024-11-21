// src/components/DetailsPage/DetailsPage.js
import React from 'react';
import { motion } from 'framer-motion';

const DetailsPage = ({ isOpen, onClose, meme }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed top-[72px] left-0 right-0 bottom-16 bg-[#1a1b1e] z-40"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        if (info.offset.y > 100) {
          onClose();
        }
      }}
    >
      <div className="max-w-md mx-auto p-4 h-full">
        <div className="flex flex-wrap gap-4">
          {/* Left Column - Description */}
          <div className="flex-1 text-gray-200">
            <h3 className="text-xl font-bold mb-4">Project Description</h3>
            <p className="text-gray-400">
              {meme?.description || "A revolutionary meme project combining community and innovation."}
            </p>
          </div>

          {/* Right Column - Buttons */}
          <div className="w-40 flex flex-col gap-2">
            <button
              onClick={() => window.open('https://t.me/cryptomeme', '_blank')}
              className="w-full px-3 py-2 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              Join Telegram Chat
            </button>
            <button
              onClick={() => window.open('https://twitter.com/cryptomeme', '_blank')}
              className="w-full px-3 py-2 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              Join Twitter
            </button>
            <button
              onClick={() => window.open('https://instagram.com/cryptomeme', '_blank')}
              className="w-full px-3 py-2 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              Join Instagram
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailsPage;