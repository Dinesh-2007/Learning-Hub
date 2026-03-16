import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import {
  INTERVIEW_MODULES,
  MODULE_VISUALS,
  WINDOW_MULTIPLIER,
  WINDOW_OPTIONS,
} from '../../config/interviewConfig';
import { ROUTE_PATHS } from '../../config/routeConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler, Tooltip, Legend);

export default function InterviewSectionPage({ sectionKey }) {
  const [windowFilter, setWindowFilter] = useState('30D');
  const [progressMode, setProgressMode] = useState('completion');

  const moduleData = useMemo(() => INTERVIEW_MODULES[sectionKey], [sectionKey]);
  const visualData = useMemo(() => MODULE_VISUALS[sectionKey] || MODULE_VISUALS.dashboard, [sectionKey]);
  const multiplier = WINDOW_MULTIPLIER[windowFilter] || 1;
  const isDashboard = sectionKey === 'dashboard';

  const progressDataset = useMemo(() => {
    if (isDashboard && visualData.progressModes?.[progressMode]?.data) {
      return visualData.progressModes[progressMode].data;
    }
    return visualData.coverage;
  }, [isDashboard, progressMode, visualData]);

  const adjustedCoverage = useMemo(
    () => progressDataset.map(item => ({ ...item, adjusted: Math.min(100, Math.round(item.value * multiplier)) })),
    [progressDataset, multiplier],
  );

  const trendChartData = useMemo(() => {
    if (!isDashboard || !visualData.scoreTrend) return null;
    return {
      labels: visualData.scoreTrend.labels,
      datasets: [{
        label: 'Mock interview score',
        data: visualData.scoreTrend.values,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        fill: true,
        tension: 0.35,
      }],
    };
  }, [isDashboard, visualData]);

  const radarChartData = useMemo(() => {
    if (!isDashboard || !visualData.radar) return null;
    return {
      labels: visualData.radar.labels,
      datasets: [{
        label: 'Skill balance',
        data: visualData.radar.values,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        pointBackgroundColor: '#6c63ff',
        pointBorderColor: '#fff',
      }],
    };
  }, [isDashboard, visualData]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#5f667b' } },
    },
    scales: {
      x: { ticks: { color: '#697089' }, grid: { color: 'rgba(31, 36, 48, 0.08)' } },
      y: { ticks: { color: '#697089' }, grid: { color: 'rgba(31, 36, 48, 0.08)' }, suggestedMin: 50, suggestedMax: 100 },
    },
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#5f667b' } },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20, color: '#697089', backdropColor: 'transparent' },
        angleLines: { color: 'rgba(31, 36, 48, 0.08)' },
        grid: { color: 'rgba(31, 36, 48, 0.08)' },
        pointLabels: { color: '#697089', font: { size: 11 } },
      },
    },
  };

  if (!moduleData) {
    return <Navigate to={ROUTE_PATHS.interviewDefault} replace />;
  }

  return (
    <div className="page">
      <Topbar title={moduleData.title} />
      <div className="page-content">
        {!isDashboard && (
          <div className="card interview-intro-card">
            <h3>{moduleData.title}</h3>
            <p className="interview-intro-text">{moduleData.description}</p>
            <div className="interview-tag-list">
              {moduleData.contentTags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="stats-grid interview-stats-grid">
          {moduleData.metrics.map(metric => (
            <StatCard
              key={metric.label}
              icon={<metric.icon />}
              label={metric.label}
              value={metric.value}
              sub={metric.sub}
              trend={metric.trend}
              color={metric.color}
            />
          ))}
        </div>

        {isDashboard && trendChartData && radarChartData && (
          <div className="interview-chart-grid">
            <div className="card">
              <h3>Interview Preparation Radar</h3>
              <div className="chart-container interview-chart-container">
                <Radar data={radarChartData} options={radarChartOptions} />
              </div>
            </div>
            <div className="card">
              <h3>Mock Interview Score Trend</h3>
              <div className="chart-container interview-chart-container">
                <Line data={trendChartData} options={lineChartOptions} />
              </div>
            </div>
          </div>
        )}

        <div className="interview-time-controls">
          <h4>Performance Window</h4>
          <div className="interview-window-buttons">
            {WINDOW_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                className={`filter-btn ${windowFilter === option ? 'active' : ''}`}
                onClick={() => setWindowFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="interview-visual-grid">
          <div className="card interview-meter-card">
            <div className="card-header">
              <h3>{visualData.readinessTitle || 'Readiness Meter'}</h3>
              <span className="interview-meter-value">{visualData.readiness}%</span>
            </div>
            <div className="interview-meter-track">
              <div className="interview-meter-fill" style={{ width: `${visualData.readiness}%` }} />
            </div>
            <div className="interview-stage-text">
              {visualData.stageProgress.completed}/{visualData.stageProgress.total} {visualData.stageProgress.label}
            </div>
            {isDashboard && visualData.stageProgress?.basedOn && (
              <ul className="interview-readiness-factors">
                {visualData.stageProgress.basedOn.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {isDashboard && visualData.stageProgress?.milestones && (
              <div className="interview-milestones">
                {visualData.stageProgress.milestones.map((milestone, index) => (
                  <span
                    key={milestone}
                    className={`interview-milestone-pill ${index < visualData.stageProgress.completed ? 'active' : ''}`}
                  >
                    {milestone}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card interview-coverage-card">
            <h3>{visualData.coverageTitle || 'Preparation Coverage'}</h3>
            {isDashboard && visualData.progressModes && (
              <div className="interview-progress-controls">
                {Object.entries(visualData.progressModes).map(([key, mode]) => (
                  <button
                    key={key}
                    type="button"
                    className={`filter-btn ${progressMode === key ? 'active' : ''}`}
                    onClick={() => setProgressMode(key)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
            {isDashboard && visualData.progressModes?.[progressMode]?.description && (
              <p className="interview-progress-description">{visualData.progressModes[progressMode].description}</p>
            )}
            <div className="interview-coverage-list">
              {adjustedCoverage.map(item => (
                <div key={item.label} className="interview-coverage-row">
                  <div className="interview-coverage-meta">
                    <span>{item.label}</span>
                    <strong>{item.adjusted}{item.suffix || '%'}</strong>
                  </div>
                  <div className="interview-coverage-track">
                    <div
                      className="interview-coverage-fill"
                      style={{ width: `${item.adjusted}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card interview-pipeline-card">
            <h3>{visualData.pipelineTitle || 'Upcoming Timeline'}</h3>
            <div className="interview-pipeline-list">
              {visualData.pipeline.map(item => (
                <div key={`${item.label}-${item.date}`} className="interview-pipeline-item">
                  <span className={`status-pill ${item.status}`}>{item.status}</span>
                  <div className="interview-pipeline-meta">
                    <p>{item.label}</p>
                    <small>{item.date}</small>
                  </div>
                  {isDashboard && item.actionLabel && (
                    <button type="button" className="interview-action-btn">
                      {item.actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card interview-activity-card">
            <h3>{visualData.activityTitle || 'Latest Activity Feed'}</h3>
            {visualData.activities && (
              <div className="interview-activity-list">
                {visualData.activities.map(activity => (
                  <div key={`${activity.title}-${activity.time}`} className="interview-activity-item">
                    <span className="activity-dot" />
                    <div>
                      <p>{activity.title}</p>
                      <small>{activity.meta}</small>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isDashboard && visualData.timeline && (
          <div className="card interview-timeline-card">
            <h3>Interview Activity Timeline</h3>
            <div className="interview-timeline-groups">
              {visualData.timeline.map(group => (
                <div key={group.day} className="interview-timeline-group">
                  <h4>{group.day}</h4>
                  <ul>
                    {group.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="interview-grid">
          {moduleData.cards.map(card => (
            <div key={card.title} className="card interview-list-card">
              <h3>{card.type === 'streak' ? '🔥 Interview Practice Streak' : card.title}</h3>
              {card.sections ? (
                card.sections.map(section => (
                  <div key={section.title} className="interview-list-section">
                    <h4>{section.title}</h4>
                    <ul className="interview-list">
                      {section.items.map(item => (
                        <li key={item}>
                          <span className="interview-list-dot" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="interview-list">
                  {card.items.map(item => (
                    <li key={item}>
                      <span className="interview-list-dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
