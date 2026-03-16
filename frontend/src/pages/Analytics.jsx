import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import {
  ANALYTICS_DATASET_STYLES,
  getActivityHeatColor,
  LIGHT_CHART_OPTIONS_WITH_ROTATED_X,
} from '../config/chartConfig';
import { ROUTE_PATHS } from '../config/routeConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Analytics() {
  const [hours, setHours] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromProgressAnalytics = Boolean(location.state?.fromProgressAnalytics);

  useEffect(() => {
    api.get('/analytics/study-hours?days=30').then(r => setHours(r.data));
    api.get('/analytics/activity-heatmap').then(r => setHeatmap(r.data));
  }, []);

  const hoursData = {
    labels: hours.map(h => new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [{
      ...ANALYTICS_DATASET_STYLES.studyHours,
      data: hours.map(h => h.hours),
    }]
  };

  const tasksData = {
    labels: hours.map(h => new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [{
      ...ANALYTICS_DATASET_STYLES.tasksCompleted,
      data: hours.map(h => h.tasks_completed),
    }]
  };

  // Build heatmap grid (last ~180 days)
  const today = new Date();
  const heatmapMap = {};
  heatmap.forEach(h => { heatmapMap[h.date] = h.hours; });
  const totalHours = hours.reduce((s, h) => s + h.hours, 0);
  const totalTasks = hours.reduce((s, h) => s + h.tasks_completed, 0);
  const avgHours = hours.length > 0 ? (totalHours / hours.length).toFixed(1) : 0;

  const heatmapDays = [];
  for (let i = 179; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    heatmapDays.push({ date: key, hours: heatmapMap[key] || 0 });
  }

  return (
    <div className="page">
      <Topbar title="Analytics" />
      <div className="page-content">
        {fromProgressAnalytics && (
          <button className="btn-back" onClick={() => navigate(ROUTE_PATHS.progressAnalytics)}>
            <FiArrowLeft /> Back to Progress & Analytics
          </button>
        )}
        <div className="stats-grid">
          <div className="card mini-stat-card"><span className="big-num">{totalHours.toFixed(1)}h</span><span>Total Study Hours</span></div>
          <div className="card mini-stat-card"><span className="big-num">{avgHours}h</span><span>Daily Average</span></div>
          <div className="card mini-stat-card"><span className="big-num">{totalTasks}</span><span>Tasks Done</span></div>
          <div className="card mini-stat-card"><span className="big-num">{hours.length}</span><span>Active Days</span></div>
        </div>

        <div className="charts-grid">
          <div className="card chart-card">
            <h3>📈 Daily Study Hours</h3>
            <div className="chart-container"><Line data={hoursData} options={LIGHT_CHART_OPTIONS_WITH_ROTATED_X} /></div>
          </div>
          <div className="card chart-card">
            <h3>✅ Tasks Completed</h3>
            <div className="chart-container"><Bar data={tasksData} options={LIGHT_CHART_OPTIONS_WITH_ROTATED_X} /></div>
          </div>
        </div>

        <div className="card heatmap-card">
          <h3>🟩 Activity Heatmap</h3>
          <div className="heatmap-grid">
            {heatmapDays.map((d, i) => (
              <div key={i} className="heatmap-cell" title={`${d.date}: ${d.hours}h`}
                style={{ backgroundColor: getActivityHeatColor(d.hours) }} />
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Less</span>
            {[0, 0.5, 1, 3, 5].map(h => (
              <div key={h} className="heatmap-cell legend" style={{ backgroundColor: getActivityHeatColor(h) }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
