import React from 'react';

const ProfilePage = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <div className="w-full px-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2d31] flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                My Profile
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[72px] px-4">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            {/* Membership Status */}
            <div className="bg-[#2c2d31] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">💎 My Membership</div>
              <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
                <div className="text-gray-200 text-base">
                  Free Tier
                </div>
              </div>
            </div>

            {/* Points */}
            <div className="bg-[#2c2d31] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">🏆 My Points</div>
              <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
                <div className="text-gray-200 text-base">
                  0
                </div>
              </div>
            </div>

            {/* Likes Available */}
            <div className="bg-[#2c2d31] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">👍 Likes Available</div>
              <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
                <div className="text-gray-200 text-base">
                  Unlimited
                </div>
              </div>
            </div>

            {/* Super Likes Available */}
            <div className="bg-[#2c2d31] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2">⭐ Super Likes Available</div>
              <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
                <div className="text-gray-200 text-base">
                  Unlimited
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;