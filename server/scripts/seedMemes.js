// server/scripts/seedMemes.js
const mongoose = require('mongoose');
const Meme = require('../models/Meme');
require('dotenv').config();

const memes = [
  {
    id: 1,
    projectName: "Pepe",
    contentType: "image/png",
    content: "/memes/meme1.png",
    weight: 1,
    logo: "/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933"
    }
  },
  {
    id: 2,
    projectName: "Pepe",
    contentType: "image/png",
    content: "/memes/meme2.png",
    weight: 1,
    logo: "/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    }
  },
  {
    id: 3,
    projectName: "Pnut",
    contentType: "image/png",
    content: "/memes/meme3.png",
    weight: 1,
    logo: "/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
    }
  },
  {
    id: 4,
    projectName: "Pepe",
    contentType: "image/png",
    content: "/memes/meme4.png",
    weight: 1,
    logo: "/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    }
  },
  {
    id: 5,
    projectName: "Pnut",
    contentType: "image/png",
    content: "/memes/meme5.png",
    weight: 1,
    logo: "/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
    }
  },
  {
    id: 6,
    projectName: "Pnut",
    contentType: "image/png",
    content: "/memes/meme6.png",
    weight: 1,
    logo: "/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
    }
  },
  {
    id: 7,
    projectName: "Pnut",
    contentType: "image/png",
    content: "/memes/meme7.png",
    weight: 1,
    logo: "/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
    }
  },
  {
    id: 8,
    projectName: "Popcat",
    contentType: "image/png",
    content: "/memes/meme8.png",
    weight: 1,
    logo: "/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    }
  },
  {
    id: 9,
    projectName: "Pnut",
    contentType: "image/png",
    content: "/memes/meme9.png",
    weight: 1,
    logo: "/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
    }
  },
  {
    id: 10,
    projectName: "Popcat",
    contentType: "image/png",
    content: "/memes/meme10.png",
    weight: 1,
    logo: "/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    }
  },
  {
    id: 11,
    projectName: "Popcat",
    contentType: "image/png",
    content: "/memes/meme11.png",
    weight: 1,
    logo: "/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    }
  },
  {
    id: 12,
    projectName: "Popcat",
    contentType: "image/png",
    content: "/memes/meme12.png",
    weight: 1,
    logo: "/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    }
  },
  {
    id: 13,
    projectName: "Popcat",
    contentType: "image/png",
    content: "/memes/meme13.png",
    weight: 1,
    logo: "/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    }
  },
  {
    id: 14,
    projectName: "Popcat",
    contentType: "image/png",
    content: "/memes/meme14.png",
    weight: 1,
    logo: "/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    }
  },
  {
    id: 15,
    projectName: "Shiba Inu",
    contentType: "image/png",
    content: "/memes/meme15.png",
    weight: 2,
    logo: "/logos/logo4.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.00002423",
      marketCap: "14B",
      priceChange24h: -1,
      contract: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    }
  },
  {
    id: 16,
    projectName: "Bonk",
    contentType: "image/png",
    content: "/memes/meme16.png",
    weight: 2,
    logo: "/logos/logo5.png",
    projectDetails: {
      network: "Solana",
      price: "0.00004122",
      marketCap: "3.1B",
      priceChange24h: -1,
      contract: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    }
  },
  {
    id: 17,
    projectName: "DogWifHat",
    contentType: "image/png",
    content: "/memes/meme17.png",
    weight: 2,
    logo: "/logos/logo6.png",
    projectDetails: {
      network: "Solana",
      price: "3.08",
      marketCap: "3B",
      priceChange24h: -1,
      contract: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    }
  },
  {
    id: 18,
    projectName: "Floki",
    contentType: "image/png",
    content: "/memes/meme18.png",
    weight: 2,
    logo: "/logos/logo7.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000213",
      marketCap: "2B",
      priceChange24h: -1,
      contract: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
    }
  },
  {
    id: 19,
    projectName: "Brett",
    contentType: "image/png",
    content: "/memes/meme19.png",
    weight: 2,
    logo: "/logos/logo8.png",
    projectDetails: {
      network: "Base",
      price: "0.1566",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "0x532f27101965dd16442e59d40670faf5ebb142e4",
    }
  },
  {
    id: 20,
    projectName: "Goatseus Maximus",
    contentType: "image/png",
    content: "/memes/meme20.png",
    weight: 2,
    logo: "/logos/logo9.png",
    projectDetails: {
      network: "Solana",
      price: "0.7226",
      marketCap: "0.72B",
      priceChange24h: -1,
      contract: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
    }
    }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Meme.deleteMany({}); // Clear existing memes
    await Meme.insertMany(memes);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();