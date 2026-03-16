import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);
  const load = () => api.get('/schedules').then(r => setSchedules(r.data));

  const toggleTask = async (taskId) => {
    await api.put(`/schedules/tasks/${taskId}/toggle`);
    load();
    toast.success('Task updated!');
  };

  const deleteSchedule = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    await api.delete(`/schedules/${id}`);
    load();
    toast.success('Schedule deleted');
  };

  return (
    <div className="page">
      <Topbar title="Study Schedule" />
      <div className="page-content">
        <div className="page-header">
          <h3>Your Study Plans</h3>
          <button className="btn-primary" onClick={() => navigate('/schedule/create')}>
            <FiPlus /> Create Schedule
          </button>
        </div>

        {schedules.length === 0 ? (
          <div className="empty-state">
            <FiCalendar size={48} />
            <h3>No schedules yet</h3>
            <p>Create your first study schedule to get started</p>
            <button className="btn-primary" onClick={() => navigate('/schedule/create')}>Create Schedule</button>
          </div>
        ) : (
          schedules.map(s => (
            <div key={s.id} className="card schedule-card">
              <div className="schedule-header">
                <div>
                  <h3>{s.title}</h3>
                  <div className="schedule-meta">
                    {s.exam_date && <span><FiCalendar /> Exam: {new Date(s.exam_date).toLocaleDateString()}</span>}
                    {s.interview_date && <span><FiCalendar /> Interview: {new Date(s.interview_date).toLocaleDateString()}</span>}
                    <span><FiClock /> {s.hours_per_day}h/day</span>
                  </div>
                </div>
                <button className="btn-danger" onClick={() => deleteSchedule(s.id)}><FiTrash2 /></button>
              </div>
              
              {s.priority_subjects?.length > 0 && (
                <div className="priority-tags">
                  {s.priority_subjects.map(p => <span key={p} className="tag priority">{p}</span>)}
                </div>
              )}

              <div className="tasks-section">
                <h4>Tasks ({s.tasks?.filter(t => t.is_completed).length}/{s.tasks?.length})</h4>
                <div className="task-progress-bar">
                  <div className="task-progress-fill" style={{ width: `${s.tasks?.length ? (s.tasks.filter(t => t.is_completed).length / s.tasks.length * 100) : 0}%` }} />
                </div>
                <ul className="schedule-tasks">
                  {(s.tasks || []).slice(0, 10).map(t => (
                    <li key={t.id} className={`schedule-task ${t.is_completed ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>
                      <span className={`check ${t.is_completed ? 'checked' : ''}`}>
                        {t.is_completed ? <FiCheckCircle /> : '○'}
                      </span>
                      <div className="task-info">
                        <span className="task-name">{t.title}</span>
                        <span className="task-date">{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`priority-dot ${t.priority}`} />
                    </li>
                  ))}
                </ul>
                {(s.tasks || []).length > 10 && <p className="more-tasks">+{s.tasks.length - 10} more tasks</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
