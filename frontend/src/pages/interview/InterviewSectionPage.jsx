import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import {
  INTERVIEW_MODULES,
  MODULE_VISUALS,
  WINDOW_MULTIPLIER,
  WINDOW_OPTIONS,
} from '../../config/interviewConfig';
import { ROUTE_PATHS } from '../../config/routeConfig';

export default function InterviewSectionPage({ sectionKey }) {
  const [windowFilter, setWindowFilter] = useState('30D');

  const moduleData = useMemo(() => INTERVIEW_MODULES[sectionKey], [sectionKey]);
  const visualData = useMemo(() => MODULE_VISUALS[sectionKey] || MODULE_VISUALS.dashboard, [sectionKey]);
  const multiplier = WINDOW_MULTIPLIER[windowFilter] || 1;

  const adjustedCoverage = useMemo(
    () => visualData.coverage.map(item => ({ ...item, adjusted: Math.min(100, Math.round(item.value * multiplier)) })),
    [visualData, multiplier],
  );

  if (!moduleData) {
    return <Navigate to={ROUTE_PATHS.interviewDefault} replace />;
  }

  return (
    <div className="page">
      <Topbar title={moduleData.title} />
      <div className="page-content">
        <div className="card interview-intro-card">
          <h3>{moduleData.title}</h3>
          <p className="interview-intro-text">{moduleData.description}</p>
          <div className="interview-tag-list">
            {moduleData.contentTags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="stats-grid interview-stats-grid">
          {moduleData.metrics.map(metric => (
            <StatCard
              key={metric.label}
              icon={<metric.icon />}
              label={metric.label}
              value={metric.value}
              sub={metric.sub}
              color={metric.color}
            />
          ))}
        </div>

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
              <h3>Readiness Meter</h3>
              <span className="interview-meter-value">{visualData.readiness}%</span>
            </div>
            <div className="interview-meter-track">
              <div className="interview-meter-fill" style={{ width: `${visualData.readiness}%` }} />
            </div>
            <div className="interview-stage-text">
              {visualData.stageProgress.completed}/{visualData.stageProgress.total} {visualData.stageProgress.label}
            </div>
          </div>

          <div className="card interview-coverage-card">
            <h3>Preparation Coverage</h3>
            <div className="interview-coverage-list">
              {adjustedCoverage.map(item => (
                <div key={item.label} className="interview-coverage-row">
                  <div className="interview-coverage-meta">
                    <span>{item.label}</span>
                    <strong>{item.adjusted}%</strong>
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
            <h3>Upcoming Timeline</h3>
            <div className="interview-pipeline-list">
              {visualData.pipeline.map(item => (
                <div key={`${item.label}-${item.date}`} className="interview-pipeline-item">
                  <span className={`status-pill ${item.status}`}>{item.status}</span>
                  <div>
                    <p>{item.label}</p>
                    <small>{item.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card interview-activity-card">
            <h3>Latest Activity Feed</h3>
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
          </div>
        </div>

        <div className="interview-grid">
          {moduleData.cards.map(card => (
            <div key={card.title} className="card interview-list-card">
              <h3>{card.title}</h3>
              <ul className="interview-list">
                {card.items.map(item => (
                  <li key={item}>
                    <span className="interview-list-dot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
