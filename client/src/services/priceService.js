// src/services/priceService.js
import axios from 'axios';

class PriceService {
  constructor() {
    this.coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';
    
    // Map our tokens to CoinGecko IDs
    this.tokenMap = {
      // Ethereum tokens
      '0x6982508145454ce325ddbe47a25d4ec3d2311933': {
        id: 'pepe',
        platform: 'ethereum'
      },
      // Solana tokens
      '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': {
        id: 'popcat',
        platform: 'solana'
      },
      '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump': {
        id: 'peanut',
        platform: 'solana'
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
        return cachedData.data;
      }
    }

    try {
      const tokenInfo = this.tokenMap[contractAddress];
      if (!tokenInfo) {
        throw new Error('Token not found in mapping');
      }

      // Fetch data from CoinGecko
      const response = await axios.get(
        `${this.coingeckoBaseUrl}/simple/price?ids=${tokenInfo.id}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
      );

      if (!response.data || !response.data[tokenInfo.id]) {
        throw new Error('Invalid API response');
      }

      const tokenData = response.data[tokenInfo.id];
      
      // Format the data
      const data = {
        price: this.formatPrice(tokenData.usd, network),
        marketCap: this.formatMarketCap(tokenData.usd_market_cap),
        priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
        volume24h: this.formatMarketCap(tokenData.usd_24h_vol),
        timestamp: Date.now()
      };

      // Update cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error fetching token data:', error.message);
      return this.cache.get(cacheKey)?.data || null;
    }
  }

  formatPrice(price, network) {
    if (!price) return '0';
    
    // For very small numbers (like PEPE), use 8 decimals
    if (network.toLowerCase() === 'ethereum' && price < 0.0001) {
      return price.toFixed(8);
    }
    
    // For regular numbers, use 6 decimals
    return price.toFixed(6);
  }

  formatPriceChange(change) {
    if (!change) return '0.00';
    return change.toFixed(2);
  }

  formatMarketCap(value) {
    if (!value) return '0';
    
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
  }
}

export const priceService = new PriceService();