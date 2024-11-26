import React, { useEffect, useState } from 'react';
import { priceService } from '../../services/priceService';

const TopBar = ({ meme, onDetailsClick, isDetailsOpen }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPriceData = async () => {
      if (!meme?.projectDetails?.contract) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await priceService.getTokenData(
          meme.projectDetails.contract,
          meme.projectDetails.network.toLowerCase()
        );
        
        if (isMounted && data) {
          console.log('Price data updated for', meme.projectName, ':', data);
          setPriceData(data);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        setError(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPriceData();
    
    // Update every 5 minutes
    const intervalId = setInterval(fetchPriceData, 300000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [meme]);

  const renderPrice = () => {
    if (loading) {
      return <span className="animate-pulse">Loading...</span>;
    }
    if (error) {
      return <span className="text-red-400">Error</span>;
    }
    return (
      <span className="text-gray-200">
        ${priceData?.price || meme?.projectDetails?.price}
      </span>
    );
  };

  const renderPriceChange = () => {
    if (loading) {
      return <span className="animate-pulse">Loading...</span>;
    }
    if (error) {
      return <span className="text-red-400">Error</span>;
    }
    const change = priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0;
    return (
      <span className={`font-medium ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {Number(change) >= 0 ? '+' : ''}{change}%
      </span>
    );
  };

  const renderMarketCap = () => {
    if (loading) {
      return <span className="animate-pulse">Loading...</span>;
    }
    if (error) {
      return <span className="text-red-400">Error</span>;
    }
    return (
      <span className="text-gray-200">
        ${priceData?.marketCap || meme?.projectDetails?.marketCap}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#1a1b1e] shadow-md">
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="text-sm text-gray-400 mb-2">
              Price: {renderPrice()}
            </div>
            <div className="text-sm text-gray-400 mb-2">
              24h Price: {renderPriceChange()}
            </div>
            <button
              onClick={onDetailsClick}
              className="w-32 px-3 py-1 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all"
            >
              {isDetailsOpen ? 'Close Details' : 'Details'}
            </button>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-400 mb-2">
              Market Cap: {renderMarketCap()}
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Network: <span className="text-gray-200">{meme?.projectDetails?.network}</span>
            </div>
            <button
              onClick={() => window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer')}
              className="w-32 px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
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