import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Topbar from '../components/Topbar';
import ProgressRing from '../components/ProgressRing';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  PROGRESS_RING_COLOR,
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
} from '../config/pageConstants';
import { ROUTE_PATHS } from '../config/routeConfig';

export default function Progress() {
  const [subjects, setSubjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fromProgressAnalytics = Boolean(location.state?.fromProgressAnalytics);

  useEffect(() => { load(); }, []);
  const load = () => {
    api.get('/progress').then(r => setSubjects(r.data));
    api.get('/progress/summary').then(r => setSummary(r.data));
  };

  const updateTopic = async (topicId, status) => {
    await api.put(`/progress/topics/${topicId}/status?status=${status}`);
    toast.success('Topic updated!');
    load();
  };

  return (
    <div className="page">
      <Topbar title="Progress Tracker" />
      <div className="page-content">
        {fromProgressAnalytics && (
          <button className="btn-back" onClick={() => navigate(ROUTE_PATHS.progressAnalytics)}>
            <FiArrowLeft /> Back to Progress & Analytics
          </button>
        )}
        {summary && (
          <div className="progress-summary-bar">
            <div className="card summary-card">
              <ProgressRing percentage={summary.completion_percentage} size={120} color={PROGRESS_RING_COLOR} />
              <div>
                <h3>Overall Completion</h3>
                <p>{summary.completed_topics} of {summary.total_topics} topics mastered</p>
              </div>
            </div>
            <div className="card summary-card mini-stat">
              <span className="big-num">{summary.total_subjects}</span>
              <span>Subjects</span>
            </div>
            <div className="card summary-card mini-stat">
              <span className="big-num">{summary.tests_completed}</span>
              <span>Tests Taken</span>
            </div>
            <div className="card summary-card mini-stat">
              <span className="big-num">{summary.resources_count}</span>
              <span>Resources</span>
            </div>
          </div>
        )}

        <div className="subjects-grid">
          {subjects.map(s => {
            const pct = s.total_topics > 0 ? (s.completed_topics / s.total_topics * 100) : 0;
            return (
              <div key={s.id} className="card subject-card">
                <div className="subject-header">
                  <h3>{s.subject}</h3>
                  <span className="subject-pct">{Math.round(pct)}%</span>
                </div>
                <div className="subject-progress-bar">
                  <div className="fill" style={{ width: `${pct}%` }} />
                </div>
                <p className="topic-count">{s.completed_topics}/{s.total_topics} topics completed</p>
                <div className="topics-list">
                  {(s.topics || []).map(t => (
                    <div key={t.id} className="topic-row">
                      <span className="topic-name">{t.topic_name}</span>
                      <select value={t.status} onChange={e => updateTopic(t.id, e.target.value)}
                        className={`topic-status ${t.status}`} style={{ color: PROGRESS_STATUS_COLORS[t.status] }}>
                        {Object.entries(PROGRESS_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
