// src/components/TopBar/TopBar.js
import React, { useEffect, useState } from 'react';
import { priceService } from '../../services/priceService';
import { ENDPOINTS } from '../../config/api'; // Add this import

const TopBar = ({ meme, onDetailsClick, isDetailsOpen }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchPriceData = async () => {
      if (!meme?.id) {
        console.log('No meme ID provided');
        setLoading(false);
        return;
      }

      console.log('Fetching price data for meme:', meme.id, meme.projectName);

      try {
        setLoading(true);
        setError(null);
        const data = await priceService.getTokenDataByMemeId(meme.id);
        
        if (isMounted) {
          console.log('Received price data:', data);
          setPriceData(data);
        }
      } catch (err) {
        console.error('Error fetching price data:', err);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(fetchPriceData, 2000 * retryCount);
        } else {
          setError('Unable to fetch latest price data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPriceData();
    const intervalId = setInterval(fetchPriceData, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [meme]);

  const handleBuyClick = () => {
    setIsButtonLoading(true);
    try {
      window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer');
    } finally {
      setIsButtonLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '$0.00';
    if (numPrice < 0.0001) return `$${numPrice.toFixed(8)}`;
    if (numPrice < 0.01) return `$${numPrice.toFixed(6)}`;
    if (numPrice < 1) return `$${numPrice.toFixed(4)}`;
    return `$${numPrice.toFixed(2)}`;
  };

  const renderPriceChange = () => {
    if (loading) {
      return <div className="h-6 w-20 bg-gray-700 animate-pulse rounded" />;
    }
    
    if (error) {
      return (
        <div className="text-red-400 text-sm mt-1">
          {error}
        </div>
      );
    }

    const change = priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0;
    const formattedChange = Number(change).toFixed(2);
    return (
      <span className={`font-medium ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {Number(change) >= 0 ? '+' : ''}{formattedChange}%
      </span>
    );
  };

   // Added new state for interaction testing
   const [testInteractionLoading, setTestInteractionLoading] = useState(false);

   // Added new function for test interactions
   const handleTestInteraction = async (action) => {
    if (!meme?.id) {
      console.error('No meme ID available');
      return;
    }
    
    setTestInteractionLoading(true);
    try {
      const payload = {
        action,
        memeId: meme.id,
        telegramId: 'test123'
      };
      
      console.log('Sending interaction:', payload);
      console.log('To endpoint:', ENDPOINTS.interactions.update);
  
      const response = await fetch(ENDPOINTS.interactions.update, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed response:', data);
        
        if (data.success) {
          alert(`${action.toUpperCase()} interaction recorded successfully!`);
        } else {
          throw new Error(data.message || 'Interaction failed');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response was:', responseText);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error(`Test ${action} interaction error:`, error);
      alert(`Error: ${error.message}`);
    } finally {
      setTestInteractionLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#1a1b1e] shadow-md">
    {/* Add test buttons in development */}
    {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') && (
      <div className="w-full bg-gray-800 p-2 flex justify-center gap-2">
        <button
          onClick={() => handleTestInteraction('like')}
          disabled={testInteractionLoading}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
        >
          Test Like 👍
        </button>
        <button
          onClick={() => handleTestInteraction('dislike')}
          disabled={testInteractionLoading}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
        >
          Test Dislike 👎
        </button>
        <button
          onClick={() => handleTestInteraction('superlike')}
          disabled={testInteractionLoading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Test Super Like ⭐
        </button>
      </div>
    )}

            {/* Existing TopBar content */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 border-b border-gray-800">
          Debug: MemeID: {meme?.id} | Loading: {loading.toString()} | 
          Error: {error || 'none'} | 
          Price: {priceData?.price || 'N/A'}
        </div>
      )}
      
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-gray-400 h-6 flex items-center">
              Price:{' '}
              {loading ? (
                <div className="ml-2 h-5 w-24 bg-gray-700 animate-pulse rounded" />
              ) : (
                <span className="ml-2 text-gray-200">
                  {formatPrice(priceData?.price || meme?.projectDetails?.price)}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400 h-6 flex items-center">
              24h Price:{' '} 
              {loading ? (
                <div className="ml-2 h-5 w-20 bg-gray-700 animate-pulse rounded" />
              ) : (
                renderPriceChange()
              )}
            </div>
            <button
              onClick={onDetailsClick}
              className="w-32 px-3 py-1 bg-[#2c2d31] text-gray-200 rounded-lg text-sm font-medium hover:bg-[#3c3d41] transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {isDetailsOpen ? '✕ Close' : 'Details'}
            </button>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="text-sm text-gray-400 h-6 flex items-center">
              Market Cap:{' '}
              {loading ? (
                <div className="ml-2 h-5 w-20 bg-gray-700 animate-pulse rounded" />
              ) : (
                <span className="text-gray-200">
                  ${priceData?.marketCap || meme?.projectDetails?.marketCap}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400 h-6 flex items-center">
              Network:{' '}
              <span className="text-gray-200">
                {meme?.projectDetails?.network}
              </span>
            </div>
            <button
              onClick={handleBuyClick}
              disabled={loading || isButtonLoading}
              className="w-32 px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isButtonLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Buy Here ↗'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;