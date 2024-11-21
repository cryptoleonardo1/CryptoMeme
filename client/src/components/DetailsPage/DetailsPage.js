// src/components/DetailsPage/DetailsPage.js
import React from 'react';
import { motion } from 'framer-motion';

const DetailsPage = ({ isOpen, meme }) => {
    return (
      <div 
        className={`fixed top-[140px] left-0 right-0 bottom-16 bg-[#1a1b1e] z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-md mx-auto p-4 h-full">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.open('https://raydium.io/', '_blank')}
              className="w-full px-3 py-2 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              Website
            </button>
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
    );
  };

export default DetailsPage;