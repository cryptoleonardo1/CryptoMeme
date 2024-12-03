//server/src/controllers/InteractionController.js
const mongoose = require('mongoose');
// Import models directly
const User = require('../models/User');
const Meme = require('../models/Meme');
const Project = require('../models/Project');
const PointsTransaction = require('../models/Points');
const ViewHistory = require('../models/ViewHistory');

class InteractionController {
  static POINTS = {
    like: 1,
    dislike: 1,
    superlike: 3
  };

  static async handleInteraction(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { action, memeId, telegramId } = req.body;

      // Validate action
      if (!['like', 'dislike', 'superlike'].includes(action)) {
        throw new Error('Invalid action');
      }

      // Get or create user
      let user = await User.findOne({ telegramId });
      if (!user) {
        user = new User({
          telegramId,
          username: req.body.username,
          totalPoints: 0,
          pointsBreakdown: {
            likes: 0,
            dislikes: 0,
            superLikes: 0
          }
        });
      }

      // Find meme and update engagement
      const meme = await Meme.findOne({ id: memeId });
      if (!meme) {
        throw new Error('Meme not found');
      }

      // Check if user has already interacted with this meme
      const existingView = await ViewHistory.findOne({
        user: telegramId,
        memeId,
        'interactions.type': action
      });

      if (existingView) {
        throw new Error('User has already performed this action on this meme');
      }

      // Update meme engagement
      if (action === 'like') {
        meme.engagement.likes += 1;
      } else if (action === 'superlike') {
        meme.engagement.superLikes += 1;
      } else {
        meme.engagement.dislikes += 1;
      }

      // Award points to user
      const points = InteractionController.POINTS[action];
      user.totalPoints += points;
      user.pointsBreakdown[action === 'superlike' ? 'superLikes' : 'likes'] += 1;

      // Create points transaction
      const pointsTransaction = new PointsTransaction({
        user: telegramId,
        amount: points,
        type: 'earn',
        source: action,
        relatedEntity: {
          entityType: 'meme',
          entityId: memeId
        },
        description: `Earned points for ${action} on meme ${memeId}`
      });

      // Record interaction in view history
      let viewHistory = await ViewHistory.findOne({ user: telegramId, memeId });
      if (!viewHistory) {
        viewHistory = new ViewHistory({
          user: telegramId,
          memeId,
          projectName: meme.projectName,
          interactions: []
        });
      }
      viewHistory.interactions.push({
        type: action,
        timestamp: new Date()
      });
      viewHistory.lastViewed = new Date();
      viewHistory.viewCount += 1;

      // Update project stats
      let project = await Project.findOne({ name: meme.projectName });
      if (!project) {
        project = new Project({
          name: meme.projectName,
          type: meme.projectDetails?.type || 'Meme',
          status: 'active'
        });
      }
      
      // Save all changes
      await Promise.all([
        meme.save({ session }),
        user.save({ session }),
        pointsTransaction.save({ session }),
        viewHistory.save({ session }),
        project.save({ session })
      ]);

      // Update project statistics
      await project.updateStats();

      await session.commitTransaction();

      res.json({
        success: true,
        data: {
          meme: {
            id: meme.id,
            engagement: meme.engagement
          },
          user: {
            telegramId: user.telegramId,
            totalPoints: user.totalPoints,
            pointsBreakdown: user.pointsBreakdown
          },
          points: points
        }
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Interaction error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    } finally {
      session.endSession();
    }
  }
}

module.exports = InteractionController;