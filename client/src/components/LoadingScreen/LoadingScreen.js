// src/components/LoadingScreen/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col items-center justify-center">
      {/* Full-width container for the image */}
      <div className="w-full flex justify-center items-center mb-8">
        <img 
          src="/loading.png" 
          alt="Loading"
          className="w-full max-w-[400px] h-auto object-contain animate-pulse"
          draggable="false"
        />
      </div>
      
      {/* Positioned loading bar and text */}
      <div className="absolute bottom-16 w-full flex flex-col items-center px-4">
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-load-progress" />
        </div>
        <p className="text-gray-400 mt-4">Loading market data...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;