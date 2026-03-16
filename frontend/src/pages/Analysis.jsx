import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import {
  LIGHT_CHART_OPTIONS,
  SCORE_DATASET_STYLES,
  SUBJECT_BREAKDOWN_DATASET_STYLES,
} from '../config/chartConfig';
import { ROUTE_PATHS } from '../config/routeConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Analysis() {
  const [perf, setPerf] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromProgressAnalytics = Boolean(location.state?.fromProgressAnalytics);

  useEffect(() => {
    api.get('/analysis/performance').then(r => setPerf(r.data));
    api.get('/analysis/subject-breakdown').then(r => setBreakdown(r.data));
  }, []);

  if (!perf) return <div className="page"><Topbar title="Test Analysis" /><div className="loading">Loading...</div></div>;

  const scoreData = {
    labels: perf.scores_over_time.map(s => new Date(s.date).toLocaleDateString()),
    datasets: [{
      ...SCORE_DATASET_STYLES.score,
      data: perf.scores_over_time.map(s => s.score),
    }, {
      ...SCORE_DATASET_STYLES.accuracy,
      data: perf.scores_over_time.map(s => s.accuracy),
    }]
  };

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
      <Topbar title="Test Analysis" />
      <div className="page-content">
        {fromProgressAnalytics && (
          <button className="btn-back" onClick={() => navigate(ROUTE_PATHS.progressAnalytics)}>
            <FiArrowLeft /> Back to Progress & Analytics
          </button>
        )}
        <div className="stats-grid">
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
      </div>
    </div>
  );
}
