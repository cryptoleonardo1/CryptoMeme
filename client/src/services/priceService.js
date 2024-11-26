// src/services/priceService.js
import axios from 'axios';

class PriceService {
  constructor() {
    this.geckoTerminalBaseUrl = 'https://api.geckoterminal.com/api/v2';
    this.coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';
  }

  cache = new Map();
  cacheTimeout = 300000; // 5 minutes cache

  formatPrice(price, network) {
    if (!price) return '0';
    
    // For very small numbers (like PEPE), use 8 decimals
    if (network.toLowerCase() === 'ethereum' && price < 0.0001) {
      return price.toFixed(8);
    }
    
    // For regular numbers, use 6 decimals
    return price.toFixed(6);
  }

  formatMarketCap(value) {
    if (!value) return '0';
    
    // Handle very large numbers properly
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

  async getTokenData(contractAddress, network = 'solana') {
    const cacheKey = `${network}-${contractAddress}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
        console.log('Returning cached data for:', cacheKey);
        return cachedData.data;
      }
    }

    try {
      console.log('Fetching fresh data for:', cacheKey, 'network:', network);
      
      let data;
      
      if (network.toLowerCase() === 'ethereum') {
        // Use CoinGecko for Ethereum tokens
        const response = await axios.get(
          `${this.coingeckoBaseUrl}/simple/token_price/ethereum/${contractAddress}?include_24hr_change=true&include_market_cap=true&vs_currencies=usd`
        );
        
        if (response.data && response.data[contractAddress.toLowerCase()]) {
          const tokenData = response.data[contractAddress.toLowerCase()];
          const price = parseFloat(tokenData.usd);
          
          data = {
            price: this.formatPrice(price, 'ethereum'),
            marketCap: this.formatMarketCap(tokenData.usd_market_cap),
            priceChange24h: (tokenData.usd_24h_change || 0).toFixed(2),
            volume24h: this.formatMarketCap(tokenData.usd_24h_vol || 0),
            timestamp: Date.now()
          };
          
          console.log('Ethereum token data:', data);
        }
      } else {
        // Use GeckoTerminal for Solana tokens
        const response = await axios.get(
          `${this.geckoTerminalBaseUrl}/networks/${network}/tokens/${contractAddress}`
        );

        if (response.data?.data?.attributes) {
          const tokenData = response.data.data.attributes;
          const price = parseFloat(tokenData.price_usd || 0);
          
          data = {
            price: this.formatPrice(price, 'solana'),
            marketCap: this.formatMarketCap(tokenData.fdv_usd || 0),
            priceChange24h: parseFloat(tokenData.price_change_24h || 0).toFixed(2),
            volume24h: this.formatMarketCap(tokenData.volume_24h || 0),
            timestamp: Date.now()
          };
          
          console.log('Solana token data:', data);
        }
      }

      if (!data) {
        throw new Error('Invalid API response');
      }

      // Update cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error fetching token data:', error.message);
      // Return cached data if available or null
      return this.cache.get(cacheKey)?.data || null;
    }
  }

  clearCache() {
    this.cache.clear();
    console.log('Cache cleared');
  }
}

export const priceService = new PriceService();