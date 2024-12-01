// Meme.js
const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  // Core meme fields
  projectName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true  // URL or base64 of image/video
  },
  contentType: {
    type: String,
    enum: ['image/png', 'video/mp4'],
    required: true
  },
  
  // Project details
  projectDetails: {
    marketCap: Number,
    priceChange24h: Number,
    holders: Number,
    network: {
      type: String,
      enum: ['TON', 'SOL', 'ETH', 'Base', 'Ethereum', 'Solana', 'BASE']
    },
    buyLink: String,
    contractAddress: String,
    socialLinks: {
      telegram: String,
      twitter: String,
      website: String
    }
  },
  
  // Display settings
  displaySettings: {
    weight: {
      type: Number,
      default: 10  // Regular meme weight
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    priority: {
      type: Number,
      default: 0
    },
    startDate: Date,
    endDate: Date
  },
  
  // Engagement metrics
  engagement: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    clickThroughs: { type: Number, default: 0 }
  },
  
  // B2B features
  business: {
    clientName: String,
    package: {
      type: String,
      enum: ['free', 'growth', 'premium']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'expired']
    },
    contactEmail: String
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'rejected'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meme', memeSchema);