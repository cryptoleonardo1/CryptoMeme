// src/services/priceService.js
import axios from 'axios';

class PriceService {
  constructor() {
    // Use proxied endpoint
    this.baseUrl = '/api/coingecko';
    
    this.tokenMap = {
      // Ethereum tokens
      '0x6982508145454ce325ddbe47a25d4ec3d2311933': {
        id: 'pepe',
        platform: 'ethereum',
        memeIds: [1, 2, 4]
      },
      '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': {
        id: 'shiba-inu',
        platform: 'ethereum',
        memeIds: [15]
      },
      '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e': {
        id: 'floki',
        platform: 'ethereum',
        memeIds: [18]
      },
      // Solana tokens
      '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': {
        id: 'popcat',
        platform: 'solana',
        memeIds: [8, 10, 11, 12, 13, 14]
      },
      '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump': {
        id: 'peanut-the-squirrel',
        platform: 'solana',
        memeIds: [3, 5, 6, 7, 9]
      },
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
        id: 'bonk',
        platform: 'solana',
        memeIds: [16]
      },
      'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': {
        id: 'dogwifhat',
        platform: 'solana',
        memeIds: [17]
      },
      'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump': {
        id: 'goatseus-maximus',
        platform: 'solana',
        memeIds: [20]
      },
      // Base tokens
      '0x532f27101965dd16442e59d40670faf5ebb142e4': {
        id: 'based-brett',
        platform: 'base',
        memeIds: [19]
      }
    };

    this.memeIdToContract = {};
    Object.entries(this.tokenMap).forEach(([contract, info]) => {
      info.memeIds.forEach(memeId => {
        this.memeIdToContract[memeId] = contract;
      });
    });
  }

  cache = new Map();
  cacheTimeout = 300000; // 5 minutes

  async getTokenDataByMemeId(memeId) {
    const contract = this.memeIdToContract[memeId];
    if (!contract) {
      console.warn('No contract found for meme ID:', memeId);
      return null;
    }
    return this.getTokenData(contract);
  }

  async getTokenData(contractAddress) {
    const tokenInfo = this.tokenMap[contractAddress];
    if (!tokenInfo) {
      console.warn('Token not found in mapping:', contractAddress);
      return null;
    }

    const cacheKey = `${tokenInfo.platform}-${contractAddress}`;
    
    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
        return cachedData.data;
      }
    }

    try {
      console.log(`Fetching data for ${tokenInfo.id} (${tokenInfo.platform})`);

      // Use separate endpoint for market data
      const response = await axios.get(`${this.baseUrl}/coins/${tokenInfo.id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });

      if (!response.data || !response.data.market_data) {
        throw new Error(`No data returned for ${tokenInfo.id}`);
      }

      const marketData = response.data.market_data;
      
      const data = {
        price: this.formatPrice(marketData.current_price.usd, tokenInfo.platform),
        marketCap: this.formatMarketCap(marketData.market_cap.usd),
        priceChange24h: this.formatPriceChange(marketData.price_change_percentage_24h),
        volume24h: this.formatMarketCap(marketData.total_volume.usd),
        timestamp: Date.now()
      };

      console.log(`Formatted data for ${tokenInfo.id}:`, data);

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Error fetching ${tokenInfo.id} data:`, error.message);
      return this.cache.get(cacheKey)?.data || null;
    }
  }

  formatPrice(price, platform) {
    if (typeof price !== 'number' || isNaN(price)) {
      return '0';
    }
    
    if (price < 0.0001) {
      return price.toFixed(8);
    } else if (price < 0.01) {
      return price.toFixed(6);
    } else {
      return price.toFixed(2);
    }
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