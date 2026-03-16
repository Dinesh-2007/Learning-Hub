import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiPlay, FiClock, FiBarChart2 } from 'react-icons/fi';

const DIFF_COLORS = { easy: '#51cf66', medium: '#ffa94d', hard: '#ff6b6b' };

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const params = filter !== 'all' ? `?test_type=${filter}` : '';
    api.get(`/tests${params}`).then(r => setTests(r.data));
  }, [filter]);

  return (
    <div className="page">
      <Topbar title="Mock Tests" />
      <div className="page-content">
        <div className="page-header">
          <div className="filter-bar">
            {['all', 'subject', 'aptitude', 'coding'].map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="test-grid">
          {tests.map(t => (
            <div key={t.id} className="card test-card">
              <div className="test-card-header">
                <span className="test-type-badge">{t.test_type}</span>
                <span className="difficulty-badge" style={{ background: DIFF_COLORS[t.difficulty] }}>
                  {t.difficulty}
                </span>
              </div>
              <h3>{t.title}</h3>
              <p className="test-desc">{t.description}</p>
              <div className="test-meta">
                <span><FiClock /> {t.duration_minutes} min</span>
                <span><FiBarChart2 /> {t.total_marks} marks</span>
                <span>📝 {t.questions?.length || 0} questions</span>
              </div>
              {t.subject && <span className="test-subject">{t.subject}</span>}
              <button className="btn-primary full-width" onClick={() => navigate(`/tests/${t.id}/take`)}>
                <FiPlay /> Start Test
              </button>
            </div>
          ))}
        </div>
        {tests.length === 0 && (
          <div className="empty-state">
            <h3>No tests available</h3>
            <p>Check back later for new mock tests</p>
          </div>
        )}
      </div>
    </div>
  );
}
