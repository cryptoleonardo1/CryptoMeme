const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('API Base URL:', BASE_URL);

export const ENDPOINTS = {
  interactions: {
    update: `${BASE_URL}/api/interactions/update`,
    debug: `${BASE_URL}/api/interactions/debug`,
    leaderboard: `${BASE_URL}/api/interactions/leaderboard`
  },
  memes: {
    create: `${BASE_URL}/api/memes/create`,
    next: `${BASE_URL}/api/memes/next`,
    interact: `${BASE_URL}/api/memes/interact`
  },
  tasks: {
    create: `${BASE_URL}/api/tasks/create`,
    complete: `${BASE_URL}/api/tasks/complete`
  },
  users: {
    create: `${BASE_URL}/api/users/create`,
    get: (telegramId) => `${BASE_URL}/api/users/${telegramId}`,
    points: `${BASE_URL}/api/users/points`
  }
};

export default ENDPOINTS;