import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { ROUTE_PATHS } from '../config/routeConfig';

const RESOURCE_SECTIONS = [
  { key: 'lecture-notes', label: 'Lecture Notes', route: ROUTE_PATHS.resources, moduleName: 'Resource Hub' },
  { key: 'personal-notes', label: 'Personal Notes', route: ROUTE_PATHS.notes, moduleName: 'Notes' },
  { key: 'pdf-study-materials', label: 'PDFs & Study Materials', route: ROUTE_PATHS.resources, moduleName: 'Resource Hub' },
  { key: 'coding-practice-links', label: 'Coding Practice Links', route: ROUTE_PATHS.resources, moduleName: 'Resource Hub' },
  { key: 'aptitude-materials', label: 'Aptitude Materials', route: ROUTE_PATHS.resources, moduleName: 'Resource Hub' },
  { key: 'interview-resources', label: 'Interview Resources', route: '/interview/resources', moduleName: 'Interview' },
];

export default function LearningResources() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Topbar title="Learning Resources" />
      <div className="page-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Unified Resource Center</h3>
          <p className="form-desc">Access all resource-related modules from one place.</p>
        </div>

        <div className="resource-grid">
          {RESOURCE_SECTIONS.map(section => (
            <div key={section.key} className="card resource-card">
              <span className="resource-subject" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{section.moduleName}</span>
              <h3>{section.label}</h3>
              <p className="resource-desc">This section opens inside {section.moduleName}.</p>
              <div className="resource-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate(section.route, { state: { fromLearningResources: true, sectionKey: section.key } })}
                >
                  Open {section.moduleName}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
