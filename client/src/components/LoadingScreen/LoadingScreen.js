// src/components/LoadingScreen/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col justify-between">
      {/* Spacer for top alignment */}
      <div className="h-20" />
      
      {/* Image container */}
      <div className="flex-1 flex items-center justify-center px-4">
        <img 
          src="/loading.png" 
          alt="Loading"
          className="w-full h-auto min-w-[300px] max-w-[600px] object-contain animate-pulse"
          draggable="false"
        />
      </div>
      
      {/* Loading bar and text container */}
      <div className="w-full px-8 mb-32">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-load-progress" />
        </div>
        <p className="text-gray-400 mt-4 text-center text-lg">Loading market data...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;