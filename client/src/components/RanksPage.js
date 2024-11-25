import React from 'react';

const RanksPage = () => {
  return (
    <div className="w-full">
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <div className="w-full px-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2d31] flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Leaderboard
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[72px]">
        {/* Leaderboard content will go here */}
      </div>
    </div>
  );
};

export default RanksPage;