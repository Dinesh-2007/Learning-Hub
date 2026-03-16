import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiBriefcase, FiChevronDown, FiChevronRight, FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { PRIMARY_NAV_LINKS, INTERVIEW_NAV_LINKS } from '../config/navigationConfig';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const isInterviewRoute = location.pathname.startsWith('/interview');
  const [isInterviewOpen, setIsInterviewOpen] = useState(isInterviewRoute);

  useEffect(() => {
    if (isInterviewRoute) setIsInterviewOpen(true);
  }, [isInterviewRoute]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">📚</div>
        <h1>StudyHub</h1>
      </div>
      
      <nav className="sidebar-nav">
        {PRIMARY_NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={`nav-link nav-dropdown-trigger ${isInterviewRoute ? 'active' : ''}`}
          onClick={() => setIsInterviewOpen(prev => !prev)}
        >
          <FiBriefcase size={18} />
          <span>Interview</span>
          <span className="dropdown-arrow">
            {isInterviewOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </span>
        </button>

        {isInterviewOpen && (
          <div className="nav-dropdown-menu">
            {INTERVIEW_NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
              >
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.full_name?.[0] || 'U'}</div>
          <div className="user-details">
            <span className="user-name">{user?.full_name || 'Student'}</span>
            <span className="user-email">{user?.username}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <FiLogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
