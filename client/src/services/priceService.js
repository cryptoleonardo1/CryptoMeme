// src/services/priceService.js
import axios from 'axios';

class PriceService {
  constructor() {
    this.geckoTerminalBaseUrl = 'https://api.geckoterminal.com/api/v2';
    this.coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';
  }

  cache = new Map();
  cacheTimeout = 300000; // 5 minutes cache

  async getTokenData(contractAddress, network = 'solana') {
    const cacheKey = `${network}-${contractAddress}`;
    
    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
        console.log('Returning cached data for:', cacheKey);
        return cachedData.data;
      }
    }

    try {
      console.log('Fetching fresh data for:', cacheKey);
      
      let data;
      
      if (network.toLowerCase() === 'ethereum') {
        // Use CoinGecko for Ethereum tokens
        const response = await axios.get(
          `${this.coingeckoBaseUrl}/simple/token_price/ethereum/${contractAddress}?include_24hr_change=true&include_market_cap=true&vs_currencies=usd`
        );
        
        if (response.data && response.data[contractAddress.toLowerCase()]) {
          const tokenData = response.data[contractAddress.toLowerCase()];
          data = {
            price: tokenData.usd.toFixed(8),
            marketCap: this.formatMarketCap(tokenData.usd_market_cap),
            priceChange24h: tokenData.usd_24h_change?.toFixed(2) || '0.00',
            timestamp: Date.now()
          };
        }
      } else {
        // Use GeckoTerminal for Solana tokens
        const response = await axios.get(
          `${this.geckoTerminalBaseUrl}/networks/${network}/tokens/${contractAddress}/pools`
        );

        if (response.data?.data?.[0]?.attributes) {
          const tokenData = response.data.data[0].attributes;
          data = {
            price: parseFloat(tokenData.token_price_usd || 0).toFixed(6),
            marketCap: this.formatMarketCap(tokenData.fdv_usd || 0),
            priceChange24h: parseFloat(tokenData.price_change_24h || 0).toFixed(2),
            timestamp: Date.now()
          };
        }
      }

      if (!data) {
        throw new Error('Invalid API response');
      }

      console.log('Formatted data:', data);

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