import React from 'react';

const TopBar = ({ meme, onDetailsClick, isDetailsOpen }) => {
  const dummyLogo = (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF3366">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1a1b1e] shadow-md z-50">
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              {dummyLogo}
              <span className="font-semibold text-gray-200 truncate">
                {meme?.projectName || "TONmeme #1"}
              </span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Network: <span className="text-gray-200">{meme?.projectDetails?.network || "TON"}</span>
            </div>
            <button
              onClick={onDetailsClick}
              className="w-32 px-3 py-1 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              {isDetailsOpen ? "Close Details" : "Details"}
            </button>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-400 mb-2">
              Market Cap: <span className="text-gray-200">${meme?.projectDetails?.marketCap || "1.8M"}</span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              24h Price: {" "}
              <span className={`font-medium ${(meme?.projectDetails?.priceChange24h || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                {(meme?.projectDetails?.priceChange24h || 0) >= 0 ? "+" : "-"}{Math.abs(meme?.projectDetails?.priceChange24h || 18)}%
              </span>
            </div>
            <button 
              onClick={() => window.open('https://raydium.io/', '_blank', 'noopener,noreferrer')}
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