// src/services/priceService.js
class PriceService {
    constructor() {
      // Using proxy endpoint instead of direct CoinGecko URL
      this.baseUrl = '/api/coingecko';
      
      // Token mappings remain the same
      this.tokens = {
        // Pepe tokens (IDs: 1, 2, 4)
        1: {
          id: 'pepe',
          network: 'ethereum'
        },
        2: {
          id: 'pepe',
          network: 'ethereum'
        },
        4: {
          id: 'pepe',
          network: 'ethereum'
        },

        // Pnut tokens (IDs: 3, 5, 6, 7, 9)
        3: {
          id: 'peanut-the-squirrel',
          network: 'solana'
        },
        5: {
          id: 'peanut-the-squirrel',
          network: 'solana'
        },
        6: {
          id: 'peanut-the-squirrel',
          network: 'solana'
        },
        7: {
          id: 'peanut-the-squirrel',
          network: 'solana'
        },
        9: {
          id: 'peanut-the-squirrel',
          network: 'solana'
        },

        // Popcat tokens (IDs: 8, 10, 11, 12, 13, 14)
        8: {
          id: 'popcat',
          network: 'solana'
        },
        10: {
          id: 'popcat',
          network: 'solana'
        },
        11: {
          id: 'popcat',
          network: 'solana'
        },
        12: {
          id: 'popcat',
          network: 'solana'
        },
        13: {
          id: 'popcat',
          network: 'solana'
        },
        14: {
          id: 'popcat',
          network: 'solana'
        },

        // Other tokens
        15: {
          id: 'shiba-inu',
          network: 'ethereum'
        },
        16: {
          id: 'bonk',
          network: 'solana'
        },
        17: {
          id: 'dogwifcoin',
          network: 'solana'
        },
        18: {
          id: 'floki',
          network: 'ethereum'
        },
        19: {
          id: 'based-brett',
          network: 'base'
        },
        20: {
          id: 'goatseus-maximus',
          network: 'solana'
        }
      };
  
      this.cache = new Map();
      this.cacheTimeout = 300000; // 5 minutes cache
      this.lastFetchTime = 0;
      this.minFetchInterval = 10000; // 10 seconds between API calls
    }
  
    async getTokenDataByMemeId(memeId) {
      const token = this.tokens[memeId];
      
      if (!token) {
        console.log(`No CoinGecko mapping for meme ID: ${memeId}, using local data`);
        return this.getFallbackDataForToken(memeId);
      }
  
      try {
        // Check cache first
        const cachedData = this.cache.get(token.id);
        if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
          console.log(`Using cached data for ${token.id}`);
          return cachedData.data;
        }
  
        // Rate limiting check
        const now = Date.now();
        const timeSinceLastFetch = now - this.lastFetchTime;
        if (timeSinceLastFetch < this.minFetchInterval) {
          console.log('Rate limit: using cached or fallback data');
          return cachedData?.data || this.getFallbackDataForToken(memeId);
        }
  
        // Fetch new data using proxy
        console.log(`Fetching fresh data for ${token.id}`);
        this.lastFetchTime = now;

        const endpoint = `/simple/price?ids=${token.id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
        console.log('Fetching from:', this.baseUrl + endpoint);
  
        const response = await fetch(this.baseUrl + endpoint);
        
        if (!response.ok) {
          console.error('API Response not OK:', response.status, response.statusText);
          const text = await response.text();
          console.error('Response text:', text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data[token.id]) {
          console.error('No data for token:', token.id);
          throw new Error('No data returned from CoinGecko');
        }
  
        const tokenData = data[token.id];
        const formatted = {
          price: this.formatPrice(tokenData.usd),
          marketCap: this.formatMarketCap(tokenData.usd_market_cap),
          priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
          timestamp: now
        };
  
        console.log('Formatted data:', formatted);
  
        // Update cache
        this.cache.set(token.id, {
          data: formatted,
          timestamp: now
        });
  
        return formatted;
      } catch (error) {
        console.error(`Error fetching ${token.id}:`, error);
        return this.getFallbackDataForToken(memeId);
      }
    }
  
    getFallbackDataForToken(memeId) {
      try {
        // Import dummyMemes data
        const dummyMemes = require('../data/dummyMemes').default;
        const meme = dummyMemes.find(m => m.id === Number(memeId));
        
        if (meme?.projectDetails) {
          const data = {
            price: meme.projectDetails.price,
            marketCap: meme.projectDetails.marketCap,
            priceChange24h: Number(meme.projectDetails.priceChange24h) || 0,
            timestamp: Date.now()
          };
          console.log(`Using fallback data for ${meme.projectName}:`, data);
          return data;
        }
      } catch (e) {
        console.warn('Could not load fallback data from dummyMemes:', e);
      }

      return {
        price: '0.00',
        marketCap: '0',
        priceChange24h: 0,
        timestamp: Date.now()
      };
    }
  
    // Rest of the methods remain the same...
}

// Make it available globally for debugging
window.priceService = new PriceService();

export const priceService = window.priceService;