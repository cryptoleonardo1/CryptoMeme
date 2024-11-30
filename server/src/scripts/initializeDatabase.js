const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const dummyMemes = require('../../client/src/data/dummyMemes');
require('dotenv').config({ path: '../../.env' });

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing memes
    await Meme.deleteMany({});
    console.log('Cleared existing memes');

    // Transform dummy memes to match our schema
    const memesToInsert = dummyMemes.map(meme => ({
      projectName: meme.projectName,
      content: meme.content,
      contentType: 'image/png',
      logo: meme.logo,
      projectDetails: {
        network: meme.projectDetails.network,
        marketCap: parseFloat(meme.projectDetails.marketCap),
        price: parseFloat(meme.projectDetails.price),
        priceChange24h: meme.projectDetails.priceChange24h,
        contract: meme.projectDetails.contract,
        website: meme.projectDetails.website,
        buyLink: meme.projectDetails.buyLink,
        socialLinks: {
          telegram: meme.projectDetails.telegramUrl,
          twitter: meme.projectDetails.twitterUrl
        }
      },
      displaySettings: {
        weight: meme.weight || 1,
        isPaid: false,
        priority: 0
      },
      engagement: {
        likes: 0,
        dislikes: 0,
        superLikes: 0,
        views: 0,
        clickThroughs: 0
      },
      status: 'active'
    }));

    // Insert all memes
    const insertedMemes = await Meme.insertMany(memesToInsert);
    console.log(`Successfully inserted ${insertedMemes.length} memes`);

    // Show sample of inserted data
    const sampleMeme = await Meme.findOne();
    console.log('\nSample inserted meme:', JSON.stringify(sampleMeme, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

initializeDatabase();