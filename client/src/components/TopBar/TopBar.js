import React from 'react';

const TopBar = ({ meme, onDetailsClick, isDetailsOpen }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1a1b1e] shadow-md z-50">
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="text-sm text-gray-400">
              Price: <span className="text-gray-200">${Number(meme?.projectDetails?.price).toFixed(6)}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Network: <span className="text-gray-200">{meme?.projectDetails?.network}</span>
            </div>
            <button
              onClick={onDetailsClick}
              className="w-32 px-3 py-1 mt-2 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              {isDetailsOpen ? "Close Details" : "Details"}
            </button>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-400 mb-2">
              Market Cap: <span className="text-gray-200">${meme?.projectDetails?.marketCap}</span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              24h Price:{" "}
              <span className={`font-medium ${(meme?.projectDetails?.priceChange24h || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                {(meme?.projectDetails?.priceChange24h || 0) >= 0 ? "+" : "-"}
                {Math.abs(meme?.projectDetails?.priceChange24h || 0)}%
              </span>
            </div>
            <button
              onClick={() => window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer')}
              className="w-32 px-3 py-1 bg-[#FF3366] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
            >
              Buy Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;