import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiAward, FiTrendingUp, FiStar, FiZap } from 'react-icons/fi';

export default function Gamification() {
  const [streak, setStreak] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.get('/gamification/streak').then(r => setStreak(r.data));
    api.get('/gamification/badges').then(r => setBadges(r.data));
    api.get('/gamification/leaderboard').then(r => setLeaderboard(r.data));
  }, []);

  const logActivity = async () => {
    const res = await api.post('/gamification/log-activity');
    api.get('/gamification/streak').then(r => setStreak(r.data));
  };

  return (
    <div className="page">
      <Topbar title="Gamification" />
      <div className="page-content">
        {/* Streak Section */}
        <div className="gamification-hero">
          <div className="card streak-hero-card">
            <div className="streak-fire">🔥</div>
            <div className="streak-big-number">{streak?.current_streak || 0}</div>
            <div className="streak-label">Day Streak</div>
            <div className="streak-details">
              <span><FiStar /> Best: {streak?.longest_streak || 0}</span>
              <span><FiZap /> Points: {streak?.total_points || 0}</span>
            </div>
            <button className="btn-primary" onClick={logActivity}>
              <FiTrendingUp /> Log Today's Activity
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="card">
          <h3>🏆 Badges</h3>
          <div className="badges-grid">
            {badges.map(b => (
              <div key={b.id} className={`badge-card ${b.earned ? 'earned' : 'locked'}`}>
                <span className="badge-icon">{b.icon}</span>
                <h4>{b.name}</h4>
                <p>{b.description}</p>
                {b.earned && <span className="badge-earned">✅ Earned</span>}
                {!b.earned && <span className="badge-locked">🔒 Locked</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card">
          <h3>🏅 Leaderboard</h3>
          <div className="leaderboard">
            {leaderboard.map((entry, i) => (
              <div key={i} className={`leaderboard-row ${i < 3 ? 'top-three' : ''}`}>
                <span className="rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span className="lb-name">{entry.full_name || entry.username}</span>
                <span className="lb-points">{entry.points} pts</span>
                <span className="lb-streak">🔥 {entry.streak}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
