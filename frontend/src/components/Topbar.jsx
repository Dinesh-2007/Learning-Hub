import { useState, useEffect } from 'react';
import { FiAward, FiBell, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Topbar({ title }) {
  const [unread, setUnread] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notifications/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">{title}</h2>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <FiSearch size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="notif-btn" onClick={() => navigate('/gamification')} title="Gamification">
          <FiAward size={20} />
        </button>
        <button className="notif-btn" onClick={() => navigate('/notifications')}>
          <FiBell size={20} />
          {unread > 0 && <span className="notif-badge">{unread}</span>}
        </button>
      </div>
    </header>
  );
}
