// src/config/api.js
const DEV_API_URL = 'http://localhost:3001';
const PROD_API_URL = 'https://your-production-api.com'; // Update this

export const API_URL = process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;

export const ENDPOINTS = {
  interactions: {
    update: `${API_URL}/api/interactions/update`,
    leaderboard: `${API_URL}/api/interactions/leaderboard`,
    debug: `${API_URL}/api/interactions/debug`
  },
  // Add other endpoints as needed
};