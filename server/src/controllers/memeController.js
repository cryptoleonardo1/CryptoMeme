// src/controllers/memeController.js
const Meme = require('../models/Meme');
const ViewHistory = require('../models/ViewHistory');

exports.createMeme = async (req, res) => {
  try {
    const meme = new Meme(req.body);
    await meme.save();
    res.status(201).json(meme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNextMeme = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's view history for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const viewedMemes = await ViewHistory.find({
      user: userId,
      lastViewed: { $gte: today }
    }).select('meme');
    
    const viewedMemeIds = viewedMemes.map(vh => vh.meme);
    
    // Find memes not viewed today, prioritizing by weight
    const meme = await Meme.findOne({
      _id: { $nin: viewedMemeIds },
      status: 'active',
      'displaySettings.startDate': { $lte: new Date() },
      'displaySettings.endDate': { $gte: new Date() }
    }).sort('-displaySettings.weight');
    
    if (!meme) {
      return res.json({ message: 'No more memes available' });
    }
    
    // Record the view
    await ViewHistory.create({
      user: userId,
      meme: meme._id,
      interactions: [{ type: 'view' }]
    });
    
    res.json(meme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.interactWithMeme = async (req, res) => {
  try {
    const { memeId, userId, interactionType } = req.body;
    
    const meme = await Meme.findById(memeId);
    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }
    
    // Update meme engagement metrics
    meme.engagement[interactionType] += 1;
    await meme.save();
    
    // Record interaction in view history
    await ViewHistory.findOneAndUpdate(
      { user: userId, meme: memeId },
      {
        $push: { interactions: { type: interactionType } },
        $inc: { viewCount: 1 },
        lastViewed: new Date()
      },
      { upsert: true }
    );
    
    res.json({ success: true, meme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};