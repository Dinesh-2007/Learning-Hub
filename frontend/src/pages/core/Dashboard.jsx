import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import api from '../api/axios';
import { FiCalendar, FiBookOpen, FiCheckCircle, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import {
  LIGHT_CHART_OPTIONS,
  SCORE_DATASET_STYLES,
  SUBJECT_BREAKDOWN_DATASET_STYLES,
} from '../config/chartConfig';
import { PROGRESS_RING_COLOR } from '../config/pageConstants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [perf, setPerf] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analytics/dashboard-summary').then(r => setData(r.data)).catch(() => {});
    api.get('/analysis/performance').then(r => setPerf(r.data)).catch(() => {});
    api.get('/analysis/subject-breakdown').then(r => setBreakdown(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="page"><Topbar title="Dashboard" /><div className="loading">Loading...</div></div>;

  const scoreData = perf ? {
    labels: perf.scores_over_time.map(s => new Date(s.date).toLocaleDateString()),
    datasets: [{
      ...SCORE_DATASET_STYLES.score,
      data: perf.scores_over_time.map(s => s.score),
    }, {
      ...SCORE_DATASET_STYLES.accuracy,
      data: perf.scores_over_time.map(s => s.accuracy),
    }]
  } : null;

  const subjectData = {
    labels: breakdown.map(b => b.subject),
    datasets: [{
      ...SUBJECT_BREAKDOWN_DATASET_STYLES.score,
      data: breakdown.map(b => b.avg_score),
    }, {
      ...SUBJECT_BREAKDOWN_DATASET_STYLES.accuracy,
      data: breakdown.map(b => b.avg_accuracy),
    }]
  };

  return (
    <div className="page">
      <Topbar title="Dashboard" />
      <div className="page-content">
        {/* Stats Row */}
        <div className="stats-grid">
          <StatCard icon={<FiCheckCircle />} label="Syllabus Complete" value={`${data.completion_percentage}%`} sub={`${data.completed_topics}/${data.total_topics} topics`} color="#6c63ff" />
          <StatCard icon={<FiCalendar />} label="Tests Completed" value={data.tests_completed} color="#ff6b6b" />
          <StatCard icon={<FiBookOpen />} label="Resources" value={data.resources_count} color="#51cf66" />
          <StatCard icon={<FiClock />} label="Weekly Hours" value={`${data.weekly_study_hours}h`} color="#ffa94d" />
        </div>

        <div className="dashboard-grid">
          {/* Progress Ring */}
          <div className="card progress-overview">
            <h3>Overall Progress</h3>
            <div className="progress-center">
              <ProgressRing percentage={data.completion_percentage} size={160} color={PROGRESS_RING_COLOR} />
            </div>
            <div className="progress-stats">
              <div><span className="stat-num">{data.completed_topics}</span><span>Completed</span></div>
              <div><span className="stat-num">{data.total_topics - data.completed_topics}</span><span>Remaining</span></div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="card today-tasks">
            <div className="card-header">
              <h3>📋 Today's Tasks</h3>
              <button className="btn-sm" onClick={() => navigate('/schedule')}>View All</button>
            </div>
            {data.today_tasks.length === 0 ? (
              <p className="empty-text">No tasks scheduled for today</p>
            ) : (
              <ul className="task-list">
                {data.today_tasks.map(t => (
                  <li key={t.id} className={`task-item ${t.is_completed ? 'completed' : ''}`}>
                    <span className={`task-dot ${t.priority}`} />
                    <span className="task-title">{t.title}</span>
                    <span className="task-subject">{t.subject}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="card upcoming-events">
            <h3>📅 Upcoming Events</h3>
            {data.upcoming_events.length === 0 ? (
              <p className="empty-text">No upcoming events</p>
            ) : (
              <ul className="event-list">
                {data.upcoming_events.map((e, i) => (
                  <li key={i} className="event-item">
                    <span className={`event-type ${e.type}`}>{e.type === 'exam' ? '📝' : '💼'}</span>
                    <div>
                      <span className="event-title">{e.title}</span>
                      <span className="event-date">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Streak Card */}
          <div className="card streak-card">
            <h3>🔥 Study Streak</h3>
            <div className="streak-display">
              <div className="streak-number">{data.current_streak}</div>
              <div className="streak-label">Day Streak</div>
            </div>
            <div className="streak-info">
              <div><FiAward /> <span>Best: {data.longest_streak} days</span></div>
              <div><FiTrendingUp /> <span>{data.total_points} points</span></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card quick-actions">
            <h3>⚡ Quick Actions</h3>
            <div className="action-grid">
              <button className="action-btn" onClick={() => navigate('/schedule/create')}><FiCalendar /> New Schedule</button>
              <button className="action-btn" onClick={() => navigate('/notes')}><FiBookOpen /> Add Notes</button>
              <button className="action-btn" onClick={() => navigate('/tests')}><FiCheckCircle /> Take Test</button>
              <button className="action-btn" onClick={() => navigate('/resources')}><FiTrendingUp /> Add Resource</button>
            </div>
          </div>
        </div>

        {perf && (
          <>
            <div className="stats-grid" style={{ marginTop: 20 }}>
              <div className="card mini-stat-card"><span className="big-num">{perf.total_tests}</span><span>Tests Taken</span></div>
              <div className="card mini-stat-card"><span className="big-num">{perf.average_score}</span><span>Avg Score</span></div>
              <div className="card mini-stat-card"><span className="big-num">{perf.average_accuracy}%</span><span>Avg Accuracy</span></div>
              <div className="card mini-stat-card"><span className="big-num">{perf.best_score}</span><span>Best Score</span></div>
            </div>

            <div className="charts-grid">
              <div className="card chart-card">
                <h3>📈 Score Trend</h3>
                <div className="chart-container"><Line data={scoreData} options={LIGHT_CHART_OPTIONS} /></div>
              </div>
              <div className="card chart-card">
                <h3>📊 Subject Breakdown</h3>
                <div className="chart-container"><Bar data={subjectData} options={LIGHT_CHART_OPTIONS} /></div>
              </div>
            </div>

            {perf.weak_areas.length > 0 && (
              <div className="card">
                <h3>⚠️ Weak Areas (Below 60% accuracy)</h3>
                <div className="weak-areas">
                  {perf.weak_areas.map((w, i) => (
                    <div key={i} className="weak-area-item">
                      <span>{w.subject}</span>
                      <div className="weak-bar"><div className="weak-fill" style={{ width: `${w.avg_accuracy}%` }} /></div>
                      <span className="weak-pct">{w.avg_accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
