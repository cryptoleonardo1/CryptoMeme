import dummyMemes from '../data/dummyMemes';

class PriceService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_ENV === 'production'
      ? 'https://api.coingecko.com/api/v3'
      : 'http://localhost:3001/api/coingecko';

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
  }

  async initializeData() {
    try {
      console.log('Starting price data initialization...');
      const tokenIds = Object.keys(this.uniqueTokens).join(',');
      
      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('Received price data:', data);

      Object.entries(data).forEach(([tokenId, tokenData]) => {
        const formatted = {
          price: this.formatPrice(tokenData.usd),
          marketCap: this.formatMarketCap(tokenData.usd_market_cap),
          priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
          timestamp: Date.now()
        };

        this.uniqueTokens[tokenId]?.forEach(memeId => {
          this.cache.set(memeId, {
            data: formatted,
            timestamp: Date.now()
          });
        });
      });

      return true;
    } catch (error) {
      console.error('Failed to load price data:', error);
      this.loadFallbackData();
      return false;
    }
  }

  loadFallbackData() {
    const now = Date.now();
    
    dummyMemes.forEach(meme => {
      if (meme?.projectDetails) {
        this.cache.set(meme.id.toString(), {
          data: {
            price: meme.projectDetails.price,
            marketCap: meme.projectDetails.marketCap,
            priceChange24h: meme.projectDetails.priceChange24h || 0,
            timestamp: now
          },
          timestamp: now
        });
      }
    });
  }

  getTokenDataByMemeId(memeId) {
    const cachedData = this.cache.get(memeId?.toString());
    if (cachedData) return cachedData.data;
    return this.getFallbackDataForMemeId(memeId);
  }

  getFallbackDataForMemeId(memeId) {
    const meme = dummyMemes.find(m => m.id === Number(memeId));
    
    if (meme?.projectDetails) {
      return {
        price: meme.projectDetails.price,
        marketCap: meme.projectDetails.marketCap,
        priceChange24h: Number(meme.projectDetails.priceChange24h) || 0,
        timestamp: Date.now()
      };
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
    const num = Number(value);
    if (isNaN(num)) return '0';
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  }
}

const priceService = new PriceService();
export { priceService };