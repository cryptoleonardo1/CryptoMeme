//dummyMemes.js

// client/src/assets/memes/
// ... import all your memes
import meme1 from '../assets/memes/meme1.png';
import meme2 from '../assets/memes/meme2.png';
import meme3 from '../assets/memes/meme3.png';
import meme4 from '../assets/memes/meme4.png';
import meme5 from '../assets/memes/meme5.png';
import meme6 from '../assets/memes/meme6.png';
import meme7 from '../assets/memes/meme7.png';
import meme8 from '../assets/memes/meme8.png';
import meme9 from '../assets/memes/meme9.png';
import meme10 from '../assets/memes/meme10.png';
import meme11 from '../assets/memes/meme11.png';
import meme12 from '../assets/memes/meme12.png';
import meme13 from '../assets/memes/meme13.png';
import meme14 from '../assets/memes/meme14.png';

// client/src/assets/logos/
// ... import all your logos
import logo1 from '../assets/logos/logo1.png';
import logo2 from '../assets/logos/logo2.png';
import logo3 from '../assets/logos/logo3.png';


const dummyMemes = [
  {
    id: 1,
    projectName: "PEPE",
    content: meme1,
    weight: 1, // Higher number = higher chance of being shown
    logo: logo1,
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: 9.5,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      website: "https://www.pepe.vip/",
      priceChart: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      twitterUrl: "https://x.com/pepecoineth"
    }
  },
  {
    id: 2,
    projectName: "PEPE",
    content: meme2,
    weight: 1,
    logo: logo1,
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: 9.5,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      website: "https://www.pepe.vip/",
      priceChart: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      twitterUrl: "https://x.com/pepecoineth"
    }
  },
  {
    id: 3,
    projectName: "PNUT",
    content: meme3,
    weight: 1,
    logo: logo3,
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -9.6,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 4,
    projectName: "PEPE",
    content: meme4,
    weight: 1,
    logo: logo1,
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: 9.5,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      website: "https://www.pepe.vip/",
      priceChart: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      twitterUrl: "https://x.com/pepecoineth"
    }
  },
  {
    id: 5,
    projectName: "PNUT",
    content: meme5,
    weight: 1,
    logo: logo3,
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -9.6,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 6,
    projectName: "PNUT",
    content: meme6,
    weight: 1,
    logo: logo3,
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -9.6,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 7,
    projectName: "PNUT",
    content: meme7,
    weight: 1,
    logo: logo3,
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -9.6,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 8,
    projectName: "POPCAT",
    content: meme8,
    weight: 1,
    logo: logo2,
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: 1.3,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 9,
    projectName: "PNUT",
    content: meme9,
    weight: 1,
    logo: logo3,
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -9.6,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 10,
    projectName: "POPCAT",
    content: meme10,
    weight: 1,
    logo: logo2,
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: 1.3,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 11,
    projectName: "POPCAT",
    content: meme11,
    weight: 1,
    logo: logo2,
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: 1.3,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 12,
    projectName: "POPCAT",
    content: meme12,
    weight: 1,
    logo: logo2,
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: 1.3,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 13,
    projectName: "POPCAT",
    content: meme13,
    weight: 1,
    logo: logo2,
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: 1.3,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 14,
    projectName: "POPCAT",
    content: meme14,
    weight: 1,
    logo: logo2,
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: 1.3,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  // ... add all your memes
];

export default dummyMemes;