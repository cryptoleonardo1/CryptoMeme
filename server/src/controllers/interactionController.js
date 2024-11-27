//server/src/controllers/interactionController.js
const User = require('../models/User');
const Meme = require('../models/Meme');
const PointsTransaction = require('../models/Points');
const ViewHistory = require('../models/ViewHistory');

exports.updateInteraction = async (req, res) => {
  try {
    const { action, memeId, telegramId } = req.body;
    
    const user = await User.findOne({ telegramId });
    const meme = await Meme.findById(memeId);

    if (!user || !meme) {
      return res.status(404).json({ message: 'User or meme not found' });
    }

    let points = 0;
    switch (action) {
      case 'like':
        points = 1;
        meme.engagement.likes += 1;
        break;
      case 'dislike':
        points = 1;
        meme.engagement.dislikes += 1;
        break;
      case 'superlike':
        points = 3;
        meme.engagement.superLikes += 1;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    // Update user points
    user.points += points;
    user.totalPoints += points;
    user.statistics[action === 'superlike' ? 'superLikes' : 'likes'] += 1;

    // Create transaction record
    await PointsTransaction.create({
      user: user._id,
      amount: points,
      type: 'earn',
      source: action,
      relatedEntity: {
        entityType: 'meme',
        entityId: meme._id
      }
    });

    // Update view history
    await ViewHistory.findOneAndUpdate(
      { user: user._id, meme: meme._id },
      {
        $push: { interactions: { type: action } },
        $inc: { viewCount: 1 },
        lastViewed: new Date()
      },
      { upsert: true }
    );

    await Promise.all([user.save(), meme.save()]);

    res.json({
      success: true,
      meme: {
        likes: meme.engagement.likes,
        superLikes: meme.engagement.superLikes
      },
      user: {
        points: user.points,
        totalPoints: user.totalPoints
      }
    });
  } catch (error) {
    console.error('Interaction error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Get top 20 users
    const users = await User.find()
      .sort('-totalPoints')
      .limit(20)
      .select('telegramId username totalPoints')
      .lean();

    // Get daily points
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

    // Add daily points to users
    const usersWithDaily = users.map(user => ({
      ...user,
      dailyPoints: dailyPointsMap.get(user._id.toString()) || 0
    }));

    // Get top memes aggregated by project
    const projectStats = await Meme.aggregate([
      {
        $group: {
          _id: '$projectName',
          totalLikes: { $sum: '$engagement.likes' },
          totalSuperLikes: { $sum: '$engagement.superLikes' },
          logo: { $first: '$logo' },
          content: { $first: '$content' }
        }
      },
      {
        $project: {
          projectName: '$_id',
          logo: 1,
          content: 1,
          engagement: {
            likes: '$totalLikes',
            superLikes: '$totalSuperLikes'
          },
          totalPoints: {
            $add: ['$totalLikes', { $multiply: ['$totalSuperLikes', 3] }]
          }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $limit: 20
      }
    ]);

    res.json({
      users: usersWithDaily,
      memes: projectStats
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: error.message });
  }
};