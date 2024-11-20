// ViewHistory.js
const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meme',
    required: true
  },
  interactions: [{
    type: {
      type: String,
      enum: ['view', 'like', 'dislike', 'superlike', 'details'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastViewed: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ViewHistory', viewHistorySchema);