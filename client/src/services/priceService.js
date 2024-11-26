// src/services/priceService.js
//test
class PriceService {
    constructor() {
      // Using simpler API endpoint
      this.baseUrl = 'https://api.coingecko.com/api/v3';
      
      // Map tokens to CoinGecko IDs (using exact CoinGecko IDs)
      this.coinMap = {
        'wif-dogwifhat': {  // Updated ID
          memeIds: [17],
          contract: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm'
        },
        pepe: {
          memeIds: [1, 2, 4],
          contract: '0x6982508145454ce325ddbe47a25d4ec3d2311933'
        },
        'peanut-the-squirrel': {
          memeIds: [3, 5, 6, 7, 9],
          contract: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump'
        },
        'popcat-sols': {  // Updated ID
          memeIds: [8, 10, 11, 12, 13, 14],
          contract: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr'
        },
        bonk: {
          memeIds: [16],
          contract: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
        },
        'shiba-inu': {
          memeIds: [15],
          contract: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'
        },
        floki: {
          memeIds: [18],
          contract: '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e'
        },
        'based-finance': {  // Updated ID
          memeIds: [19],
          contract: '0x532f27101965dd16442e59d40670faf5ebb142e4'
        },
        'goatseus-maximus-sol': {  // Updated ID
          memeIds: [20],
          contract: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
        }
      };
  
      // Create reverse mapping
      this.memeToToken = {};
      Object.entries(this.coinMap).forEach(([token, info]) => {
        info.memeIds.forEach(memeId => {
          this.memeToToken[memeId] = token;
        });
      });
    }
  
    cache = new Map();
    cacheTimeout = 300000; // 5 minutes
  
    async getTokenDataByMemeId(memeId) {
      try {
        const tokenId = this.memeToToken[memeId];
        if (!tokenId) {
          console.warn('No token found for meme ID:', memeId);
          return null;
        }
        return await this.fetchTokenData(tokenId);
      } catch (error) {
        console.error('Error in getTokenDataByMemeId:', error);
        return null;
      }
    }
  
    async fetchTokenData(tokenId) {
      try {
        // Check cache first
        if (this.cache.has(tokenId)) {
          const cachedData = this.cache.get(tokenId);
          if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
            console.log(`Using cached data for ${tokenId}`);
            return cachedData.data;
          }
        }
  
        console.log(`Fetching fresh data for ${tokenId}`);
  
        // Use the /coins endpoint for more detailed data
        const url = `${this.baseUrl}/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (!data.market_data) {
          throw new Error('No market data available');
        }
  
        const formatted = {
          price: this.formatPrice(data.market_data.current_price.usd),
          marketCap: this.formatMarketCap(data.market_data.market_cap.usd),
          priceChange24h: this.formatPriceChange(data.market_data.price_change_percentage_24h),
          timestamp: Date.now()
        };
  
        // Update cache
        this.cache.set(tokenId, {
          data: formatted,
          timestamp: Date.now()
        });
  
        console.log(`Formatted data for ${tokenId}:`, formatted);
        return formatted;
  
      } catch (error) {
        console.error(`Error fetching data for ${tokenId}:`, error);
        return this.fallbackToStaticData(tokenId);
      }
    }
  
    fallbackToStaticData(tokenId) {
      // Return cached data if available
      if (this.cache.has(tokenId)) {
        return this.cache.get(tokenId).data;
      }
  
      // Default static data as last resort
      return {
        price: '0.00',
        marketCap: '0',
        priceChange24h: '0.00',
        timestamp: Date.now()
      };
    }
  
    formatPrice(price) {
      if (!price) return '0';
      if (price < 0.0001) {
        return price.toFixed(8);
      } else if (price < 0.01) {
        return price.toFixed(6);
      }
      return price.toFixed(2);
    }
  
    formatPriceChange(change) {
      if (!change) return '0.00';
      return change.toFixed(2);
    }
  
    formatMarketCap(value) {
      if (!value) return '0';
      if (value >= 1e9) {
        return `${(value / 1e9).toFixed(1)}B`;
      } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(1)}M`;
      } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(1)}K`;
      }
      return value.toFixed(2);
    }
  
    clearCache() {
      this.cache.clear();
      console.log('Cache cleared');
    }
  }
  
  export const priceService = new PriceService();