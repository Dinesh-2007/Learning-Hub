import { useState, useEffect, useRef } from 'react';
import { FiAward, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { NOTIFICATION_TYPE_META } from '../config/pageConstants';

export default function Topbar({ title }) {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = () => {
    api.get('/notifications/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
    api.get('/notifications').then(r => setNotifications(r.data || [])).catch(() => setNotifications([]));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const onMouseDown = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(() => {});
    loadNotifications();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">{title}</h2>
      </div>
      <div className="topbar-right">
        <button className="notif-btn" onClick={() => navigate('/gamification')} title="Gamification">
          <FiAward size={25} />
        </button>
        <div className="notif-wrap" ref={notifRef}>
          <button
            className="notif-btn"
            onClick={() => setIsNotifOpen(prev => !prev)}
            title="Notifications"
          >
            <FiBell size={25} />
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>

          {isNotifOpen && (
            <div className="notif-popover">
              <div className="notif-popover-header">
                <strong>Notifications</strong>
                <span>{unread} unread</span>
              </div>

              <div className="notif-popover-list">
                {notifications.slice(0, 5).map((n) => {
                  const meta = NOTIFICATION_TYPE_META[n.notification_type] || NOTIFICATION_TYPE_META.info;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      className={`notif-popover-item ${n.is_read ? 'read' : 'unread'}`}
                      onClick={() => {
                        if (!n.is_read) markRead(n.id);
                      }}
                    >
                      <span className="notif-popover-icon" style={{ color: meta.color, background: `${meta.color}22` }}>
                        <Icon size={14} />
                      </span>
                      <span className="notif-popover-text">
                        <span className="notif-popover-title">{n.title}</span>
                        <span className="notif-popover-message">{n.message}</span>
                      </span>
                    </button>
                  );
                })}

                {notifications.length === 0 && (
                  <div className="notif-popover-empty">No notifications</div>
                )}
              </div>

              <button
                type="button"
                className="notif-popover-footer"
                onClick={() => {
                  setIsNotifOpen(false);
                  navigate('/notifications');
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
