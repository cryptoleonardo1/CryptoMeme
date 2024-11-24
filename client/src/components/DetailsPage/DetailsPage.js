import React from 'react';

const DetailsPage = ({ isOpen, meme }) => {
  const handleCopyContract = async () => {
    try {
      await navigator.clipboard.writeText(meme?.projectDetails?.contract || '');
      // Optionally add a toast/notification here
    } catch (err) {
      console.error('Failed to copy contract address');
    }
  };

  return (
    <div
      className={`fixed left-0 right-0 bg-[#1a1b1e] z-50 transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-[-120%]'
      }`}
      style={{
        top: '140px',
        bottom: '60px',
        backgroundColor: '#1a1b1e',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-md mx-auto p-4 h-full">
        <div className="flex flex-col gap-4">
          {/* Contract Information */}
          <div className="bg-[#2c2d31] rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Contract</div>
            <div className="flex items-center gap-2">
              <div className="text-gray-200 text-sm truncate">
                {meme?.projectDetails?.contract || 'N/A'}
              </div>
              <button
                onClick={handleCopyContract}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={() => window.open(meme?.projectDetails?.website || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Website
          </button>
          
          <button
            onClick={() => window.open(meme?.projectDetails?.priceChart || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Price Chart
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