// src/services/priceService.js
class PriceService {
    constructor() {
      this.baseUrl = 'https://api.coingecko.com/api/v3';
      
      // Token mappings remain the same as before
      this.tokens = {
        1: { id: 'pepe', network: 'ethereum' },
        2: { id: 'pepe', network: 'ethereum' },
        4: { id: 'pepe', network: 'ethereum' },
        3: { id: 'peanut-the-squirrel', network: 'solana' },
        5: { id: 'peanut-the-squirrel', network: 'solana' },
        6: { id: 'peanut-the-squirrel', network: 'solana' },
        7: { id: 'peanut-the-squirrel', network: 'solana' },
        9: { id: 'peanut-the-squirrel', network: 'solana' },
        8: { id: 'popcat', network: 'solana' },
        10: { id: 'popcat', network: 'solana' },
        11: { id: 'popcat', network: 'solana' },
        12: { id: 'popcat', network: 'solana' },
        13: { id: 'popcat', network: 'solana' },
        14: { id: 'popcat', network: 'solana' },
        15: { id: 'shiba-inu', network: 'ethereum' },
        16: { id: 'bonk', network: 'solana' },
        17: { id: 'dogwifcoin', network: 'solana' },
        18: { id: 'floki', network: 'ethereum' },
        19: { id: 'based-brett', network: 'base' },
        20: { id: 'goatseus-maximus', network: 'solana' }
      };

      this.cache = new Map();
      this.cacheTimeout = 60000; // 1 minute cache
      this.lastFetchTime = Date.now() - 10000;
      this.minFetchInterval = 6000; // 6 seconds between calls
    }

    async getTokenDataByMemeId(memeId) {
      const token = this.tokens[memeId];
      
      if (!token) {
        console.log(`No CoinGecko mapping for meme ID: ${memeId}, using fallback`);
        return this.getFallbackDataForToken(memeId);
      }

      // Check cache
      const cachedData = this.cache.get(token.id);
      if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
        return cachedData.data;
      }

      // Check rate limiting
      const now = Date.now();
      if (now - this.lastFetchTime < this.minFetchInterval) {
        return cachedData?.data || this.getFallbackDataForToken(memeId);
      }

      try {
        this.lastFetchTime = now;

        // Using free CoinGecko API endpoint
        const response = await fetch(
          `${this.baseUrl}/simple/price?ids=${token.id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data[token.id]) {
          throw new Error('No data returned for token');
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
        console.warn('API fetch failed:', error);
        return this.getFallbackDataForToken(memeId);
      }
    }

    getFallbackDataForToken(memeId) {
      try {
        const dummyMemes = require('../data/dummyMemes').default;
        const meme = dummyMemes.find(m => m.id === Number(memeId));
        
        if (meme?.projectDetails) {
          return {
            price: meme.projectDetails.price,
            marketCap: meme.projectDetails.marketCap,
            priceChange24h: Number(meme.projectDetails.priceChange24h) || 0,
            timestamp: Date.now()
          };
        }
      } catch (e) {
        console.warn('Failed to load fallback data:', e);
      }

      return {
        price: '0.00',
        marketCap: '0',
        priceChange24h: 0,
        timestamp: Date.now()
      };
    }

    formatPrice(price) {
      if (!price) return '0.00';
      const numPrice = typeof price === 'string' ? Number(price) : price;
      if (isNaN(numPrice)) return '0.00';
      if (numPrice < 0.0001) return numPrice.toFixed(8);
      if (numPrice < 0.01) return numPrice.toFixed(6);
      if (numPrice < 1) return numPrice.toFixed(4);
      return numPrice.toFixed(2);
    }

    formatPriceChange(change) {
      if (!change) return 0;
      return Number(Number(change).toFixed(2));
    }

    formatMarketCap(value) {
      if (!value) return '0';
      if (typeof value === 'string') {
        if (/[BMK]$/i.test(value)) return value;
        value = Number(value.replace(/[^0-9.-]+/g, ''));
      }
      if (isNaN(value)) return '0';
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return value.toFixed(2);
    }
}

// Create single instance
const priceService = new PriceService();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.priceService = priceService;
}

export { priceService };