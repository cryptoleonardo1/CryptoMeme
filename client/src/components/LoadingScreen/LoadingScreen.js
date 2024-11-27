// src/components/LoadingScreen/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col">
      {/* Main content area with large image */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[90vw] h-[90vw] max-w-[800px] max-h-[800px]">
          <img 
            src="/loading.png" 
            alt="Loading"
            className="w-full h-full object-contain animate-pulse"
            draggable="false"
          />
        </div>
      </div>
      
      {/* Loading bar container fixed at bottom */}
      <div className="w-full px-6 mb-20">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-load-progress" />
        </div>
        <p className="text-gray-400 mt-4 text-center text-lg">Loading market data...</p>
      </div>
    </div>
  );
};


export default LoadingScreen;