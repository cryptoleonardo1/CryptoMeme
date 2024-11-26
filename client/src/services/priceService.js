// src/services/priceService.js
class PriceService {
    constructor() {
      // Using simple price endpoint
      this.baseUrl = 'https://api.coingecko.com/api/v3';
      
      // List of CoinGecko IDs for all tokens
      this.tokens = {
        15: { // Shiba
          id: 'shiba-inu',
          network: 'ethereum'
        },
        1: { // Pepe
          id: 'pepe',
          network: 'ethereum'
        },
        17: { // DogWifHat
          id: 'dogwifhat',
          network: 'solana'
        },
        8: { // Popcat
          id: 'popcat',
          network: 'solana'
        },
        16: { // Bonk
          id: 'bonk',
          network: 'solana'
        },
        18: { // Floki
          id: 'floki',
          network: 'ethereum'
        },
        19: { // Brett
          id: 'based-brett',
          network: 'base'
        },
        20: { // Goatseus
          id: 'goatseus-maximus',
          network: 'solana'
        }
      };
  
      this.cache = new Map();
      this.cacheTimeout = 60000; // 1 minute cache
      this.lastFetchTime = 0;
      this.minFetchInterval = 6000; // 6 seconds between API calls
    }
  
    async getTokenDataByMemeId(memeId) {
      const token = this.tokens[memeId];
      if (!token) {
        console.warn('No token found for meme ID:', memeId);
        return this.getFallbackData();
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
          return cachedData?.data || this.getFallbackData();
        }
  
        // Fetch new data
        console.log(`Fetching fresh data for ${token.id}`);
        this.lastFetchTime = now;
  
        const response = await fetch(
          `${this.baseUrl}/simple/price?ids=${token.id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (!data[token.id]) {
          throw new Error('No data returned');
        }
  
        const tokenData = data[token.id];
        const formatted = {
          price: this.formatPrice(tokenData.usd),
          marketCap: this.formatMarketCap(tokenData.usd_market_cap),
          priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
          timestamp: now
        };
  
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
      // Return cached data if available
      const token = this.tokens[memeId];
      if (token) {
        const cachedData = this.cache.get(token.id);
        if (cachedData) {
          return cachedData.data;
        }
      }
      return this.getFallbackData();
    }
  
    getFallbackData() {
      return {
        price: '0.00',
        marketCap: '0',
        priceChange24h: '0.00',
        timestamp: Date.now()
      };
    }
  
    formatPrice(price) {
      if (!price) return '0.00';
      if (price < 0.0001) return price.toFixed(8);
      if (price < 0.01) return price.toFixed(6);
      if (price < 1) return price.toFixed(4);
      return price.toFixed(2);
    }
  
    formatPriceChange(change) {
      if (!change) return '0.00';
      return change.toFixed(2);
    }
  
    formatMarketCap(value) {
      if (!value) return '0';
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return value.toFixed(2);
    }
  
    clearCache() {
      this.cache.clear();
      this.lastFetchTime = 0;
      console.log('Cache cleared');
    }
  }
  
  // Make it available globally for debugging
  window.priceService = new PriceService();
  
  export const priceService = window.priceService;