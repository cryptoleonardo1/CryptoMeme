// Points.js
const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend', 'expire', 'bonus'],
    required: true
  },
  source: {
    type: String,
    enum: ['like', 'dislike', 'superlike', 'task', 'referral', 'daily', 'premium'],
    required: true
  },
  relatedEntity: {
    // Can be a task, meme, or referral
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId
  },
  description: String,
  expiryDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);