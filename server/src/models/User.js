// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Core user fields
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  
  // Points and Status
  points: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0  // Lifetime points (never resets)
  },
  
  // Premium Status
  premium: {
    isActive: {
      type: Boolean,
      default: false
    },
    expiryDate: Date,
    purchaseHistory: [{
      date: Date,
      amount: Number,
      currency: String,
      duration: Number // in days
    }]
  },
  
  // Engagement metrics
  statistics: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 }
  },
  
  // Daily limits
  dailyLimits: {
    likesRemaining: { type: Number, default: 20 },
    superLikesRemaining: { type: Number, default: 3 },
    lastReset: Date
  },
  
  // Extended features
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  },
  
  // Referral system
  referralCode: String,
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);