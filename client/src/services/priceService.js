// src/services/priceService.js
import axios from 'axios';

class PriceService {
  constructor() {
    this.coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';
    
    // Updated token mapping with correct IDs
    this.tokenMap = {
      // Ethereum tokens
      '0x6982508145454ce325ddbe47a25d4ec3d2311933': {
        id: 'pepe',
        platform: 'ethereum'
      },
      '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': {
        id: 'shiba-inu',
        platform: 'ethereum'
      },
      '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e': {
        id: 'floki',
        platform: 'ethereum'
      },
      // Solana tokens
      '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': {
        id: 'popcat',
        platform: 'solana'
      },
      '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump': {
        id: 'peanut-the-squirrel',
        platform: 'solana'
      },
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
        id: 'bonk',
        platform: 'solana'
      },
      'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': {
        id: 'dogwifhat',  // Verified correct ID
        platform: 'solana'
      },
      'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump': {
        id: 'goatseus-maximus',
        platform: 'solana'
      },
      // Base tokens
      '0x532f27101965dd16442e59d40670faf5ebb142e4': {
        id: 'based-brett',
        platform: 'base'
      }
    };
  }

  cache = new Map();
  cacheTimeout = 300000; // 5 minutes cache

  async getTokenData(contractAddress, network = 'solana') {
    const cacheKey = `${network}-${contractAddress}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
        console.log('Using cached data for:', cacheKey);
        return cachedData.data;
      }
    }

    try {
      const tokenInfo = this.tokenMap[contractAddress];
      if (!tokenInfo) {
        console.warn('Token not found in mapping:', contractAddress);
        return null;
      }

      console.log('Fetching fresh data for token:', tokenInfo.id);

      // Split requests to handle rate limiting better
      const response = await axios.get(
        `${this.coingeckoBaseUrl}/simple/price`,
        {
          params: {
            ids: tokenInfo.id,
            vs_currencies: 'usd',
            include_24hr_vol: true,
            include_24hr_change: true,
            include_market_cap: true,
            precision: 18
          }
        }
      );

      if (!response.data || !response.data[tokenInfo.id]) {
        console.error('Invalid response for token:', tokenInfo.id, response.data);
        throw new Error(`No data returned for ${tokenInfo.id}`);
      }

      const tokenData = response.data[tokenInfo.id];
      
      // Format the data
      const data = {
        price: this.formatPrice(tokenData.usd, tokenInfo.platform),
        marketCap: this.formatMarketCap(tokenData.usd_market_cap),
        priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
        volume24h: this.formatMarketCap(tokenData.usd_24h_vol),
        timestamp: Date.now()
      };

      console.log('Formatted data for', tokenInfo.id, ':', data);

      // Update cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error fetching token data:', contractAddress, error.message);
      
      // Return cached data if available
      if (this.cache.has(cacheKey)) {
        console.log('Returning stale cached data for:', cacheKey);
        return this.cache.get(cacheKey).data;
      }
      
      // Return null if no cache available
      return null;
    }
  }

  formatPrice(price, platform) {
    if (typeof price !== 'number' || isNaN(price)) {
      console.warn('Invalid price value:', price);
      return '0';
    }
    
    // For very small numbers (like PEPE, SHIB, BONK), use 8 decimals
    if ((platform === 'ethereum' || platform === 'solana') && price < 0.0001) {
      return price.toFixed(8);
    }
    
    // For regular numbers, use 6 decimals
    return price.toFixed(6);
  }

  formatPriceChange(change) {
    if (typeof change !== 'number' || isNaN(change)) {
      return '0.00';
    }
    return change.toFixed(2);
  }

  formatMarketCap(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0';
    }
    
    const bn = 1000000000;
    const mn = 1000000;
    const kn = 1000;
    
    if (value >= bn) {
      return `${(value / bn).toFixed(1)}B`;
    } else if (value >= mn) {
      return `${(value / mn).toFixed(1)}M`;
    } else if (value >= kn) {
      return `${(value / kn).toFixed(1)}K`;
    }
    return value.toFixed(2);
  }

  clearCache() {
    this.cache.clear();
    console.log('Cache cleared');
  }
}

export const priceService = new PriceService();