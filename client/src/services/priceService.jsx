// src/services/priceService.js
class PriceService {
    constructor() {
      // For development, use proxy. For production, use direct CoinGecko URL
      this.baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api.coingecko.com/api/v3'
        : '/api/coingecko';
      
      // Token mappings remain the same
      this.uniqueTokens = {
        'pepe': ['1', '2', '4'],
        'peanut-the-squirrel': ['3', '5', '6', '7', '9'],
        'popcat': ['8', '10', '11', '12', '13', '14'],
        'shiba-inu': ['15'],
        'bonk': ['16'],
        'dogwifcoin': ['17'],
        'floki': ['18'],
        'based-brett': ['19'],
        'goatseus-maximus': ['20']
      };

      this.cache = new Map();
      this.cacheTimeout = 3600000; // 1 hour
      this.loadingPromise = null;
    }

    async initializeData() {
      // If already loading, return existing promise
      if (this.loadingPromise) {
        return this.loadingPromise;
      }

      this.loadingPromise = (async () => {
        try {
          const tokenIds = Object.keys(this.uniqueTokens).join(',');
          console.log('Starting initial data load...');

          const response = await fetch(
            `${this.baseUrl}/simple/price?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
            {
              method: 'GET',
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
          const now = Date.now();

          console.log('Received data:', data);

          // Process each token's data
          Object.entries(data).forEach(([tokenId, tokenData]) => {
            const formatted = {
              price: this.formatPrice(tokenData.usd),
              marketCap: this.formatMarketCap(tokenData.usd_market_cap),
              priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
              timestamp: now
            };

            // Cache data for all meme IDs using this token
            this.uniqueTokens[tokenId].forEach(memeId => {
              this.cache.set(memeId, {
                data: formatted,
                timestamp: now
              });
            });
          });

          console.log('Data load completed successfully');
          return true;

        } catch (error) {
          console.error('Failed to load price data:', error);
          this.loadAllFallbackData();
          return false;
        } finally {
          // Clear the loading promise after completion
          this.loadingPromise = null;
        }
      })();

      return this.loadingPromise;
    }
    
    async fetchPriceData(contract, network) {
      try {
          // First try to get from cache
          const memeId = this.getMemeIdFromContract(contract);
          if (memeId) {
              return this.getTokenDataByMemeId(memeId);
          }

          // If not in cache, fetch new data
          const response = await fetch(`${this.baseUrl}/simple/price?ids=${contract}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return {
              price: this.formatPrice(data[contract]?.usd),
              marketCap: this.formatMarketCap(data[contract]?.usd_market_cap),
              priceChange24h: this.formatPriceChange(data[contract]?.usd_24h_change)
          };
      } catch (error) {
          console.error('Error fetching price data:', error);
          return {
              price: '0.00',
              marketCap: '0',
              priceChange24h: 0
          };
      }
  }

  getMemeIdFromContract(contract) {
      // Helper method to find meme ID from contract
      for (const [tokenId, memeIds] of Object.entries(this.uniqueTokens)) {
          if (tokenId.toLowerCase() === contract.toLowerCase()) {
              return memeIds[0]; // Return first meme ID associated with this token
          }
      }
      return null;
  }


    loadAllFallbackData() {
      console.log('Loading fallback data...');
      try {
        const dummyMemes = require('../data/dummyMemes').default;
        const now = Date.now();

        dummyMemes.forEach(meme => {
          if (meme?.projectDetails) {
            this.cache.set(meme.id.toString(), {
              data: {
                price: meme.projectDetails.price,
                marketCap: meme.projectDetails.marketCap,
                priceChange24h: Number(meme.projectDetails.priceChange24h) || 0,
                timestamp: now
              },
              timestamp: now
            });
          }
        });
      } catch (e) {
        console.error('Error loading fallback data:', e);
      }
    }

    getTokenDataByMemeId(memeId) {
      const cachedData = this.cache.get(memeId.toString());
      if (cachedData) {
        return cachedData.data;
      }
      return this.getFallbackDataForToken(memeId);
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