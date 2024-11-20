// Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  metrics: {
    activeUsers: Number,
    newUsers: Number,
    totalLikes: Number,
    totalDislikes: Number,
    totalSuperLikes: Number,
    totalViews: Number,
    completedTasks: Number,
    premiumConversions: Number,
    revenueUSD: Number
  },
  topMemes: [{
    meme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meme'
    },
    likes: Number,
    views: Number
  }],
  topUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    points: Number,
    interactions: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);