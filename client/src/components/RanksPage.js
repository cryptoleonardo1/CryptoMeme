import React, { useState, useEffect } from 'react';

const RanksPage = () => {
  const [leaderboardData, setLeaderboardData] = useState({
    users: [],
    memes: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchLeaderboardData();
    const interval = setInterval(fetchLeaderboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/interactions/leaderboard');
      const data = await response.json();
      setLeaderboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLoading(false);
    }
  };

  const formatPoints = (points) => {
    return Number(points).toLocaleString();
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
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[72px] px-4">
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
        ) : (
          <div className="rounded-lg overflow-hidden bg-[#2c2d31]">
            {activeTab === 'users' ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#3c3d41] text-gray-300">
                    <th className="py-3 px-4 text-left w-16">#</th>
                    <th className="py-3 px-4 text-left">Username</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.users.slice(0, 20).map((user, index) => (
                    <tr key={user._id} className="border-t border-[#3c3d41]/30">
                      <td className="py-3 px-4">
                        <span className="text-xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {user.username || `User ${user.telegramId?.slice(-4)}`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-white">{formatPoints(user.totalPoints)}</div>
                        <div className="text-xs text-green-400">+{formatPoints(user.dailyPoints)} today</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#3c3d41] text-gray-300">
                    <th className="py-3 px-4 text-left w-16">#</th>
                    <th className="py-3 px-4 text-left">Project</th>
                    <th className="py-3 px-4 text-center">Likes</th>
                    <th className="py-3 px-4 text-center">Super Likes</th>
                    <th className="py-3 px-4 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.memes.slice(0, 20).map((meme, index) => (
                    <tr key={meme._id} className="border-t border-[#3c3d41]/30">
                      <td className="py-3 px-4">#{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img src={meme.logo || meme.content} alt={meme.projectName} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-white">{meme.projectName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300">
                        <span className="inline-flex items-center gap-1">
                          <span>👍</span>
                          {meme.engagement.likes}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300">
                        <span className="inline-flex items-center gap-1">
                          <span>⭐</span>
                          {meme.engagement.superLikes}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-white">
                        {formatPoints(meme.engagement.likes + (meme.engagement.superLikes * 3))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RanksPage;