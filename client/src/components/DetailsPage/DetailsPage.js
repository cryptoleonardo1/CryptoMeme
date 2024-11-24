import React from 'react';

const DetailsPage = ({ isOpen, meme }) => {
  return (
    <div
      className={`fixed left-0 right-0 bg-[#1a1b1e] z-50 transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-[-120%]'
      }`}
      style={{
        top: '140px', // Increased from 80px to ensure full visibility
        bottom: '60px', // Height of the bottom navigation
        backgroundColor: '#1a1b1e',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Optional: adds a subtle separator
      }}
    >
      <div className="max-w-md mx-auto p-4 h-full">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => window.open(meme?.projectDetails?.website || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Website
          </button>
          <button
            onClick={() => window.open(meme?.projectDetails?.telegramUrl || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Join Telegram Chat
          </button>
          <button
            onClick={() => window.open(meme?.projectDetails?.twitterUrl || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Join Twitter
          </button>
          <button
            onClick={() => window.open(meme?.projectDetails?.instagramUrl || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Join Instagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;