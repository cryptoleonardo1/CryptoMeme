//server/src/controllers/LeaderboardController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Analytics = require('../models/Analytics');

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
      const { type = 'all', limit = 50 } = req.query;

      // Get top users
      const users = await User.find()
        .select('telegramId username totalPoints pointsBreakdown')
        .sort('-totalPoints')
        .limit(limit);

      // Get top projects
      const projects = await Project.find()
        .select('name totalScore engagement type')
        .sort('-totalScore')
        .limit(limit);

      // Store analytics
      const analytics = new Analytics({
        date: new Date(),
        topUsers: users.map(user => ({
          telegramId: user.telegramId,
          username: user.username,
          points: user.totalPoints,
          interactions: user.pointsBreakdown.likes + 
                       user.pointsBreakdown.dislikes + 
                       user.pointsBreakdown.superLikes
        })),
        topProjects: projects.map(project => ({
          projectName: project.name,
          likes: project.engagement.likes,
          superLikes: project.engagement.superLikes,
          score: project.totalScore
        }))
      });
      await analytics.save();

      // Format response based on type
      let response = {
        success: true,
        timestamp: new Date()
      };

      if (type === 'all' || type === 'users') {
        response.users = users.map(user => ({
          telegramId: user.telegramId,
          username: user.username,
          totalPoints: user.totalPoints,
          breakdown: user.pointsBreakdown
        }));
      }

      if (type === 'all' || type === 'projects') {
        response.projects = projects.map(project => ({
          name: project.name,
          score: project.totalScore,
          likes: project.engagement.likes,
          superLikes: project.engagement.superLikes,
          type: project.type
        }));
      }

      res.json(response);

    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUserRank(req, res) {
    try {
      const { telegramId } = req.params;

      // Get user's position
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const rank = await User.countDocuments({
        totalPoints: { $gt: user.totalPoints }
      }) + 1;

      res.json({
        success: true,
        data: {
          telegramId: user.telegramId,
          username: user.username,
          rank,
          totalPoints: user.totalPoints,
          breakdown: user.pointsBreakdown
        }
      });

    } catch (error) {
      console.error('Get user rank error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = LeaderboardController;