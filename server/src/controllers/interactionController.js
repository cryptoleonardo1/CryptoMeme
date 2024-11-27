const User = require('../models/User');
const Meme = require('../models/Meme');
const PointsTransaction = require('../models/Points');
const ViewHistory = require('../models/ViewHistory');

exports.updateInteraction = async (req, res) => {
  try {
    const { action, memeId, telegramId } = req.body;

    // Find user and meme
    const user = await User.findOne({ telegramId });
    const meme = await Meme.findById(memeId);

    if (!user || !meme) {
      return res.status(404).json({ message: 'User or meme not found' });
    }

    // Determine points based on action
    let points = 0;
    let type = '';
    switch (action) {
      case 'like':
        points = 1;
        type = 'likes';
        meme.engagement.likes += 1;
        break;
      case 'dislike':
        points = 1;
        type = 'dislikes';
        meme.engagement.dislikes += 1;
        break;
      case 'superlike':
        points = 3;
        type = 'superLikes';
        meme.engagement.superLikes += 1;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    // Update user points and statistics
    user.points += points;
    user.totalPoints += points;
    user.statistics[type] += 1;

    // Create points transaction
    await PointsTransaction.create({
      user: user._id,
      amount: points,
      type: 'earn',
      source: action,
      relatedEntity: {
        entityType: 'meme',
        entityId: meme._id
      },
      description: `Earned points for ${action} on meme`
    });

    // Record interaction in view history
    await ViewHistory.findOneAndUpdate(
      { user: user._id, meme: meme._id },
      {
        $push: { interactions: { type: action } },
        $inc: { viewCount: 1 },
        lastViewed: new Date()
      },
      { upsert: true }
    );

    // Save updates
    await Promise.all([user.save(), meme.save()]);

    res.json({
      success: true,
      points: user.points,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Get top users
    const users = await User.find()
      .sort('-totalPoints')
      .limit(50)
      .select('telegramId username totalPoints statistics')
      .lean();

    // Calculate daily points for users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyPoints = await PointsTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$user',
          dailyPoints: { $sum: '$amount' }
        }
      }
    ]);

    const dailyPointsMap = new Map(
      dailyPoints.map(item => [item._id.toString(), item.dailyPoints])
    );

    const usersWithDaily = users.map(user => ({
      ...user,
      dailyPoints: dailyPointsMap.get(user._id.toString()) || 0
    }));

    // Get top memes
    const memes = await Meme.find()
      .sort({
        'engagement.superLikes': -1,
        'engagement.likes': -1
      })
      .limit(50)
      .select('projectName content engagement')
      .lean();

    res.json({
      users: usersWithDaily,
      memes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};