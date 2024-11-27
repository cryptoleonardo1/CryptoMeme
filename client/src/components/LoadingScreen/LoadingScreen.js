// src/components/LoadingScreen/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col">
      {/* Image container taking full screen width */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/loading.png" 
          alt="Loading"
          style={{ width: '100%' }}
          className="animate-pulse"
          draggable="false"
        />
      </div>
      
      {/* Loading bar at bottom */}
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