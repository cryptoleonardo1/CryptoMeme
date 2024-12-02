// src/config/api.js
const DEV_API_URL = 'http://localhost:3001';
const PROD_API_URL = 'http://localhost:3001'; // Keep using localhost for now while testing

export const API_URL = process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;

// Helper function for API calls
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const ENDPOINTS = {
  interactions: {
    update: `${API_URL}/api/interactions/update`,
    leaderboard: `${API_URL}/api/interactions/leaderboard`,
    debug: `${API_URL}/api/interactions/debug`
  },
  memes: {
    create: `${API_URL}/api/memes/create`,
    next: `${API_URL}/api/memes/next`,
    interact: `${API_URL}/api/memes/interact`
  },
  tasks: {
    create: `${API_URL}/api/tasks/create`,
    complete: `${API_URL}/api/tasks/complete`
  },
  users: {
    create: `${API_URL}/api/users/create`,
    get: (telegramId) => `${API_URL}/api/users/${telegramId}`,
    points: `${API_URL}/api/users/points`
  }
};