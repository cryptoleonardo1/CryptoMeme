// src/services/priceService.js
import axios from 'axios';

class PriceService {
  constructor() {
    // Base URLs for different APIs
    this.geckoTerminalBaseUrl = 'https://api.geckoterminal.com/api/v2';
  }

  // Increase cache timeout to 5 minutes for free tier
  cache = new Map();
  cacheTimeout = 300000; // 5 minutes cache

  async getTokenData(contractAddress, network = 'solana') {
    const cacheKey = `${network}-${contractAddress}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
        console.log('Returning cached data for:', cacheKey);
        return cachedData.data;
      }
    }

    try {
      console.log('Fetching fresh data for:', cacheKey);
      
      // Fetch token data from GeckoTerminal
      const response = await axios.get(
        `${this.geckoTerminalBaseUrl}/networks/${network}/tokens/${contractAddress}`
      );

      if (!response.data || !response.data.data) {
        console.log('No data received from API for:', cacheKey);
        throw new Error('Invalid API response');
      }

      const tokenData = response.data.data.attributes;
      
      // Format the data
      const formattedData = {
        price: parseFloat(tokenData.price_usd || 0).toFixed(6),
        marketCap: this.formatMarketCap(tokenData.fdv_usd || 0),
        priceChange24h: parseFloat(tokenData.price_change_24h || 0).toFixed(2),
        volume24h: this.formatMarketCap(tokenData.volume_24h || 0),
        timestamp: Date.now()
      };

      console.log('Formatted data:', formattedData);

      // Update cache
      this.cache.set(cacheKey, {
        data: formattedData,
        timestamp: Date.now()
      });

      return formattedData;
    } catch (error) {
      console.error('Error fetching token data:', error.message);
      // Return cached data if available, otherwise return null
      return this.cache.get(cacheKey)?.data || null;
    }
  }

  formatMarketCap(value) {
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