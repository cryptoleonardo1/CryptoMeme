const User = require('../models/User');
const Meme = require('../models/Meme');
const PointsTransaction = require('../models/Points');
const ViewHistory = require('../models/ViewHistory');

exports.updateInteraction = async (req, res) => {
  try {
    console.log('Received interaction request:', req.body);
    
    const { action, memeId, telegramId } = req.body;
    
    // Improved meme lookup - handles both string and ObjectId formats
    const meme = await Meme.findOne({
      $or: [
        { _id: memeId },
        { id: parseInt(memeId) }
      ]
    });

    // Improved user lookup/creation
    let user = await User.findOne({ telegramId: telegramId });
    
    // If no user exists and we have a telegramId, create one
    if (!user && telegramId) {
      user = await User.create({
        telegramId,
        points: 0,
        totalPoints: 0,
        statistics: {
          likes: 0,
          dislikes: 0,
          superLikes: 0
        }
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found or could not be created' 
      });
    }

    if (!meme) {
      return res.status(404).json({ 
        success: false, 
        message: 'Meme not found',
        memeId 
      });
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
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    // Update user points
    user.points = (user.points || 0) + points;
    user.totalPoints = (user.totalPoints || 0) + points;
    
    // Update user statistics
    user.statistics = user.statistics || {};
    if (action === 'superlike') {
      user.statistics.superLikes = (user.statistics.superLikes || 0) + 1;
    } else if (action === 'like') {
      user.statistics.likes = (user.statistics.likes || 0) + 1;
    } else {
      user.statistics.dislikes = (user.statistics.dislikes || 0) + 1;
    }

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

    console.log('Updated meme engagement:', meme.engagement);
    console.log('Updated user points:', user.points);

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Get top users
    const users = await User.find()
      .sort('-totalPoints')
      .limit(20)
      .select('telegramId username totalPoints statistics')
      .lean();

    // Get project stats with aggregation
    const projects = await Meme.aggregate([
      {
        $group: {
          _id: '$projectName',
          totalLikes: { $sum: '$engagement.likes' },
          totalSuperLikes: { $sum: '$engagement.superLikes' },
          memeCount: { $sum: 1 },
          logo: { $first: '$logo' }
        }
      },
      {
        $project: {
          projectName: '$_id',
          logo: 1,
          totalLikes: 1,
          totalSuperLikes: 1,
          memeCount: 1,
          totalPoints: {
            $add: [
              '$totalLikes',
              { $multiply: ['$totalSuperLikes', 3] }
            ]
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
      users,
      projects
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};