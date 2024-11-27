import React, { useState, useEffect } from 'react';

const RanksPage = () => {
  const [leaderboardData, setLeaderboardData] = useState({
    users: [],
    memes: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'memes'

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1b1e]">
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <div className="w-full px-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2d31] flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Leaderboard
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[72px] px-4">
        {/* Tab Switcher */}
        <div className="flex rounded-lg overflow-hidden mb-4 bg-[#2c2d31]">
          <button
            className={`flex-1 py-2 px-4 ${activeTab === 'users' ? 'bg-[#3c3d41] text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`flex-1 py-2 px-4 ${activeTab === 'memes' ? 'bg-[#3c3d41] text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('memes')}
          >
            Memes
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-4">
            {leaderboardData.users.map((user, index) => (
              <div
                key={user._id}
                className="flex items-center gap-4 bg-[#2c2d31] p-4 rounded-lg"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{user.username || `User ${user.telegramId}`}</h3>
                  <p className="text-sm text-gray-400">{user.totalPoints} points</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Today: +{user.dailyPoints}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboardData.memes.map((meme, index) => (
              <div
                key={meme._id}
                className="flex items-center gap-4 bg-[#2c2d31] p-4 rounded-lg"
              >
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img src={meme.content} alt={meme.projectName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{meme.projectName}</h3>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>👍 {meme.engagement.likes}</span>
                    <span>⭐ {meme.engagement.superLikes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RanksPage;