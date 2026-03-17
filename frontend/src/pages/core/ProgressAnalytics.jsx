import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import { ROUTE_PATHS } from '../../config/routeConfig';

const ANALYTICS_SECTIONS = [
  { key: 'syllabus-completion', label: 'Syllabus Completion', route: ROUTE_PATHS.progress },
  { key: 'topic-progress', label: 'Topic Progress', route: ROUTE_PATHS.progress },
  { key: 'study-activity-heatmap', label: 'Study Activity Heatmap', route: ROUTE_PATHS.analytics },
  { key: 'mock-test-performance', label: 'Mock Test Performance', route: ROUTE_PATHS.analysis },
  { key: 'weak-topic-detection', label: 'Weak Topic Detection', route: ROUTE_PATHS.analysis },
  { key: 'preparation-trends', label: 'Preparation Trends', route: ROUTE_PATHS.analytics },
];

export default function ProgressAnalytics() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Topbar title="Progress & Analytics" />
      <div className="page-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Preparation Visibility Hub</h3>
          <p className="form-desc">Access progress and analytics modules from one place.</p>
        </div>

        <div className="resource-grid">
          {ANALYTICS_SECTIONS.map(section => (
            <div key={section.key} className="card resource-card">
              <h3>{section.label}</h3>
              <p className="resource-desc">Open the existing detailed page for this section.</p>
              <div className="resource-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate(section.route, { state: { fromProgressAnalytics: true, sectionKey: section.key } })}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
