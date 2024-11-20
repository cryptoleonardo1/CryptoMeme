// Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // Core task fields
  type: {
    type: String,
    enum: ['social', 'referral', 'engagement', 'custom'],
    required: true
  },
  action: {
    type: String,
    required: true  // e.g., 'join_telegram', 'follow_twitter'
  },
  points: {
    type: Number,
    required: true
  },
  
  // Task details
  details: {
    platform: String,
    link: String,
    requirement: String,
    verificationMethod: {
      type: String,
      enum: ['automatic', 'manual', 'callback']
    }
  },
  
  // Related project (if B2B task)
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meme'
  },
  
  // Completion tracking
  completions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: Date,
    verified: Boolean
  }],
  
  // Task settings
  settings: {
    isRepeatable: {
      type: Boolean,
      default: false
    },
    frequency: String,  // 'once', 'daily', 'weekly'
    expiryDate: Date,
    maxCompletions: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);