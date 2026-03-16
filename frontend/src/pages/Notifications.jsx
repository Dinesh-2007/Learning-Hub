import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { NOTIFICATION_TYPE_META } from '../config/pageConstants';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { load(); }, []);
  const load = () => api.get('/notifications').then(r => setNotifications(r.data));

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    load();
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    toast.success('All marked as read');
    load();
  };

  return (
    <div className="page">
      <Topbar title="Notifications" />
      <div className="page-content">
        <div className="page-header">
          <h3>{notifications.filter(n => !n.is_read).length} unread</h3>
          <button className="btn-secondary" onClick={markAllRead}><FiCheckCircle /> Mark All Read</button>
        </div>

        <div className="notifications-list">
          {notifications.map(n => {
            const meta = NOTIFICATION_TYPE_META[n.notification_type] || NOTIFICATION_TYPE_META.info;
            const Icon = meta.icon;
            return (
              <div key={n.id} className={`card notification-card ${n.is_read ? 'read' : 'unread'}`} onClick={() => !n.is_read && markRead(n.id)}>
                <div className="notif-icon" style={{ color: meta.color, background: `${meta.color}22` }}>
                  <Icon />
                </div>
                <div className="notif-content">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                  <span className="notif-time">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                {!n.is_read && <div className="unread-dot" />}
              </div>
            );
          })}
        </div>
        {notifications.length === 0 && <div className="empty-state"><h3>No notifications</h3></div>}
      </div>
    </div>
  );
}
