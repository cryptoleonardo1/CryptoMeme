const User = require('../models/User');
const Meme = require('../models/Meme');
const PointsTransaction = require('../models/Points');
const ViewHistory = require('../models/ViewHistory');

exports.updateInteraction = async (req, res) => {
  try {
    console.log('Received interaction:', req.body); // Debug log
    const { action, memeId, telegramId } = req.body;
    
    // Find user and meme
    const user = await User.findOne({ telegramId });
    const meme = await Meme.findById(memeId);

    if (!user) {
      console.log('User not found:', telegramId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!meme) {
      console.log('Meme not found:', memeId);
      return res.status(404).json({ message: 'Meme not found' });
    }

    // Initialize engagement if it doesn't exist
    if (!meme.engagement) {
      meme.engagement = {
        likes: 0,
        dislikes: 0,
        superLikes: 0,
        views: 0
      };
    }

    // Determine points and update engagement
    let points = 0;
    switch (action) {
      case 'like':
        points = 1;
        meme.engagement.likes = (meme.engagement.likes || 0) + 1;
        break;
      case 'dislike':
        points = 1;
        meme.engagement.dislikes = (meme.engagement.dislikes || 0) + 1;
        break;
      case 'superlike':
        points = 3;
        meme.engagement.superLikes = (meme.engagement.superLikes || 0) + 1;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    // Update user points
    user.points = (user.points || 0) + points;
    user.totalPoints = (user.totalPoints || 0) + points;
    user.statistics = user.statistics || {};
    user.statistics[action === 'superlike' ? 'superLikes' : 'likes'] = 
      (user.statistics[action === 'superlike' ? 'superLikes' : 'likes'] || 0) + 1;

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
      description: `Earned points for ${action} on ${meme.projectName}`
    });

    // Save updates
    await Promise.all([user.save(), meme.save()]);

    console.log('Updated meme engagement:', meme.engagement); // Debug log

    res.json({
      success: true,
      meme: {
        id: meme._id,
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
    console.log('Fetching leaderboard data'); // Debug log
    
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

    // Get project stats with combined meme points
    const projectStats = await Meme.aggregate([
      {
        $group: {
          _id: '$projectName',
          logo: { $first: '$logo' },
          likes: { $sum: '$engagement.likes' },
          superLikes: { $sum: '$engagement.superLikes' }
        }
      },
      {
        $project: {
          projectName: '$_id',
          logo: 1,
          engagement: {
            likes: '$likes',
            superLikes: '$superLikes'
          },
          totalPoints: {
            $add: ['$likes', { $multiply: ['$superLikes', 3] }]
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

    console.log('Leaderboard data:', { users: usersWithDaily.length, projects: projectStats.length }); // Debug log

    res.json({
      users: usersWithDaily,
      memes: projectStats
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: error.message });
  }
};