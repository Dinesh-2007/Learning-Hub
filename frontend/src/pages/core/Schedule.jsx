import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import {
  FiPlus, FiTrash2, FiCalendar, FiClock, FiCheckCircle,
  FiList, FiGrid, FiChevronLeft, FiChevronRight,
  FiPlay, FiPause, FiSquare, FiAlertTriangle, FiZap,
  FiAward, FiTrendingUp, FiActivity
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const PRIORITY_META = {
  high:   { label: 'High',   color: '#ff6b6b', emoji: '🔴' },
  medium: { label: 'Medium', color: '#ffa94d', emoji: '🟠' },
  low:    { label: 'Low',    color: '#51cf66', emoji: '🟢' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86400000);
  return diff;
}

function formatMinutes(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}h ${String(m).padStart(2,'0')}m`
    : `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}

function calendarMatrix(year, month) {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  let day = 1 - first;
  for (let r = 0; r < 6; r++) {
    const row = [];
    for (let c = 0; c < 7; c++, day++) {
      row.push(day >= 1 && day <= daysInMonth ? day : null);
    }
    cells.push(row);
    if (day > daysInMonth) break;
  }
  return cells;
}

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function OverviewPanel({ schedules, streak }) {
  const allTasks = schedules.flatMap(s => s.tasks || []);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.is_completed).length;
  const pendingTasks = totalTasks - doneTasks;
  const pct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;

  const today = new Date().toDateString();
  const todayTasks = allTasks.filter(t => new Date(t.date).toDateString() === today);

  const nextExam = schedules
    .filter(s => s.exam_date)
    .map(s => ({ title: s.title, days: daysUntil(s.exam_date) }))
    .filter(s => s.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  const subjectMap = {};
  allTasks.forEach(t => {
    if (!t.subject) return;
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { total: 0, done: 0 };
    subjectMap[t.subject].total++;
    if (t.is_completed) subjectMap[t.subject].done++;
  });
  const subjects = Object.entries(subjectMap);

  return (
    <div className="planner-overview">
      <h3 className="overview-title">📋 Planner Overview</h3>
      <div className="overview-stats-grid">
        <div className="ov-card ov-exam">
          <div className="ov-icon">📅</div>
          <div>
            <span className="ov-label">Next Exam</span>
            {nextExam
              ? <><span className="ov-value">{nextExam.days}d</span><span className="ov-sub">{nextExam.title}</span></>
              : <span className="ov-sub">No upcoming exams</span>}
          </div>
        </div>

        <div className="ov-card ov-done">
          <div className="ov-icon">✅</div>
          <div>
            <span className="ov-label">Tasks Completed</span>
            <span className="ov-value">{doneTasks} <span className="ov-of">/ {totalTasks}</span></span>
          </div>
        </div>

        <div className="ov-card ov-today">
          <div className="ov-icon">⏳</div>
          <div>
            <span className="ov-label">Today's Tasks</span>
            <span className="ov-value">{todayTasks.length}</span>
            <span className="ov-sub">{todayTasks.filter(t => t.is_completed).length} done</span>
          </div>
        </div>

        <div className="ov-card ov-progress">
          <div className="ov-icon">📊</div>
          <div>
            <span className="ov-label">Study Progress</span>
            <span className="ov-value">{pct}%</span>
            <div className="ov-bar"><div className="ov-bar-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>

        <div className="ov-card ov-streak">
          <div className="ov-icon">🔥</div>
          <div>
            <span className="ov-label">Study Streak</span>
            <span className="ov-value">{streak?.current_streak ?? 0} days</span>
            <span className="ov-sub">Longest: {streak?.longest_streak ?? 0}d</span>
          </div>
        </div>

        <div className="ov-card ov-pending">
          <div className="ov-icon">📌</div>
          <div>
            <span className="ov-label">Pending Tasks</span>
            <span className="ov-value">{pendingTasks}</span>
          </div>
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="subject-progress-panel">
          <h4>Subject Progress</h4>
          {subjects.map(([sub, d]) => {
            const p = d.total ? Math.round(d.done / d.total * 100) : 0;
            return (
              <div key={sub} className="sp-row">
                <span className="sp-name">{sub}</span>
                <div className="sp-bar-wrap">
                  <div className="sp-bar-fill" style={{ width: `${p}%` }} />
                </div>
                <span className="sp-pct">{p}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function StudyTimer({ goal_hours }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [todayTotal, setTodayTotal] = useState(() => {
    const s = localStorage.getItem('planner_today_seconds');
    return s ? parseInt(s, 10) : 0;
  });
  const intervalRef = useRef(null);
  const startRef = useRef(null);

  const goalSec = (goal_hours || 5) * 3600;

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStop = () => {
    setRunning(false);
    const newTotal = todayTotal + elapsed;
    setTodayTotal(newTotal);
    localStorage.setItem('planner_today_seconds', newTotal);
    api.post('/analytics/log-study', {
      hours_studied: parseFloat((elapsed / 3600).toFixed(2)),
      subjects_covered: [],
      tasks_completed: 0,
    }).catch(() => {});
    setElapsed(0);
    toast.success('Study session saved!');
  };

  const pct = Math.min(100, Math.round(todayTotal / goalSec * 100));

  return (
    <div className="study-timer-card card">
      <div className="timer-header">
        <FiActivity size={18} /> <span>Study Timer</span>
      </div>
      <div className="timer-display">{formatMinutes(elapsed)}</div>
      <div className="timer-controls">
        {!running
          ? <button className="timer-btn start" onClick={() => setRunning(true)}><FiPlay /> Start</button>
          : <button className="timer-btn pause" onClick={() => setRunning(false)}><FiPause /> Pause</button>}
        <button className="timer-btn stop" onClick={handleStop} disabled={elapsed === 0}><FiSquare /> Stop</button>
      </div>
      <div className="timer-today">
        <span>Today: {formatMinutes(todayTotal)}</span>
        <span className="timer-goal">/ {goal_hours || 5}h goal</span>
      </div>
      <div className="timer-goal-bar">
        <div className="timer-goal-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}


function CalendarView({ schedules, onToggle }) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calView, setCalView] = useState('month'); // 'month' | 'week'

  const allTasks = schedules.flatMap(s => (s.tasks || []).map(t => ({
    ...t, scheduleTitle: s.title,
    dateObj: new Date(t.date),
  })));

  const tasksByDate = {};
  allTasks.forEach(t => {
    const key = t.dateObj.toDateString();
    if (!tasksByDate[key]) tasksByDate[key] = [];
    tasksByDate[key].push(t);
  });

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const matrix = calendarMatrix(calYear, calMonth);

  return (
    <div className="calendar-panel card">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}><FiChevronLeft /></button>
        <span className="cal-title">{MONTH_NAMES[calMonth]} {calYear}</span>
        <button className="cal-nav" onClick={nextMonth}><FiChevronRight /></button>
      </div>
      <div className="cal-grid">
        {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {matrix.flat().map((day, idx) => {
          if (!day) return <div key={idx} className="cal-cell empty" />;
          const cellDate = new Date(calYear, calMonth, day);
          const key = cellDate.toDateString();
          const tasks = tasksByDate[key] || [];
          const isToday = cellDate.toDateString() === today.toDateString();
          return (
            <div key={idx} className={`cal-cell ${isToday ? 'today' : ''}`}>
              <span className="cal-day-num">{day}</span>
              {tasks.slice(0, 2).map(t => (
                <div
                  key={t.id}
                  className={`cal-task-dot ${t.priority} ${t.is_completed ? 'done' : ''}`}
                  title={t.title}
                  onClick={() => onToggle(t.id)}
                >
                  {PRIORITY_META[t.priority]?.emoji} {t.title.length > 14 ? t.title.slice(0, 14) + '…' : t.title}
                </div>
              ))}
              {tasks.length > 2 && <div className="cal-more">+{tasks.length - 2}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function AddTaskModal({ scheduleId, onClose, onAdded }) {
  const [form, setForm] = useState({ title: '', subject: '', date: '', duration_hours: 1, priority: 'medium' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/schedules/${scheduleId}/tasks`, {
        ...form,
        date: new Date(form.date).toISOString(),
      });
      toast.success('Task added!');
      onAdded();
      onClose();
    } catch {
      toast.error('Failed to add task');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>Add Task</h3>
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label>Title</label>
            <input required placeholder="e.g. Study DSA – Chapter 3"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <input placeholder="DSA, DBMS…"
                value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input required type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Est. Hours</label>
              <input type="number" min="0.5" max="12" step="0.5" value={form.duration_hours}
                onChange={e => setForm({ ...form, duration_hours: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="high">🔴 High</option>
                <option value="medium">🟠 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function ScheduleCard({ s, onToggle, onDelete, onTasksChanged }) {
  const done = (s.tasks || []).filter(t => t.is_completed).length;
  const total = (s.tasks || []).length;
  const pct = total ? Math.round(done / total * 100) : 0;
  const [showAll, setShowAll] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const today = new Date().toDateString();
  const todayTasks = (s.tasks || []).filter(t => new Date(t.date).toDateString() === today);
  const behindTasks = (s.tasks || []).filter(t => !t.is_completed && new Date(t.date) < new Date() - 86400000);

  const tasks = showAll ? (s.tasks || []) : (s.tasks || []).slice(0, 10);

  const changePriority = async (taskId, priority) => {
    await api.put(`/schedules/tasks/${taskId}`, { priority });
    onTasksChanged();
  };

  const subjectMap = {};
  (s.tasks || []).forEach(t => {
    if (!t.subject) return;
    if (!subjectMap[t.subject]) subjectMap[t.subject] = { total: 0, done: 0 };
    subjectMap[t.subject].total++;
    if (t.is_completed) subjectMap[t.subject].done++;
  });

  return (
    <div className="card schedule-card">
      <div className="schedule-header">
        <div>
          <h3>{s.title}</h3>
          <div className="schedule-meta">
            {s.exam_date && (
              <span>
                <FiCalendar /> Exam: {new Date(s.exam_date).toLocaleDateString()}
                {daysUntil(s.exam_date) !== null && daysUntil(s.exam_date) >= 0
                  ? <span className="days-badge">{daysUntil(s.exam_date)}d left</span>
                  : <span className="days-badge overdue">Passed</span>}
              </span>
            )}
            {s.interview_date && <span><FiCalendar /> Interview: {new Date(s.interview_date).toLocaleDateString()}</span>}
            <span><FiClock /> {s.hours_per_day}h/day</span>
          </div>
        </div>
        <div className="schedule-actions">
          <button className="btn-sm btn-icon" onClick={() => setShowAddTask(true)} title="Add task"><FiPlus /></button>
          <button className="btn-danger btn-icon" onClick={() => onDelete(s.id)} title="Delete"><FiTrash2 /></button>
        </div>
      </div>

      {s.priority_subjects?.length > 0 && (
        <div className="priority-tags">
          {s.priority_subjects.map(p => <span key={p} className="tag priority">{p}</span>)}
        </div>
      )}

      {behindTasks.length > 0 && (
        <div className="behind-alert">
          <FiAlertTriangle /> You are behind on {behindTasks[0].subject || behindTasks[0].title}.
          Suggested: study it for {s.hours_per_day}h tomorrow.
        </div>
      )}

      {/* Subject progress bars */}
      {Object.entries(subjectMap).length > 0 && (
        <div className="subject-mini-progress">
          {Object.entries(subjectMap).map(([sub, d]) => {
            const p = d.total ? Math.round(d.done / d.total * 100) : 0;
            return (
              <div key={sub} className="sp-row">
                <span className="sp-name">{sub}</span>
                <div className="sp-bar-wrap"><div className="sp-bar-fill" style={{ width: `${p}%` }} /></div>
                <span className="sp-pct">{p}%</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="tasks-section">
        <div className="tasks-header-row">
          <h4>Tasks ({done}/{total})</h4>
          {todayTasks.length > 0 && <span className="today-badge">📅 {todayTasks.length} today</span>}
        </div>
        <div className="task-progress-bar">
          <div className="task-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <ul className="schedule-tasks">
          {tasks.map(t => (
            <li
              key={t.id}
              className={`schedule-task ${t.is_completed ? 'done' : ''}`}
              draggable
              onDragStart={e => e.dataTransfer.setData('taskId', t.id)}
            >
              <span className={`check ${t.is_completed ? 'checked' : ''}`} onClick={() => onToggle(t.id)}>
                {t.is_completed ? <FiCheckCircle /> : '○'}
              </span>
              <div className="task-info" onClick={() => onToggle(t.id)}>
                <span className="task-name">
                  {PRIORITY_META[t.priority]?.emoji} {t.title}
                </span>
                <div className="task-meta-row">
                  <span className="task-date">📅 {new Date(t.date).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</span>
                  {t.duration_hours > 0 && <span className="task-dur">⏳ {t.duration_hours}h</span>}
                  {t.subject && <span className="task-subject-chip">{t.subject}</span>}
                </div>
              </div>
              <select
                className={`priority-select psel-${t.priority}`}
                value={t.priority}
                onChange={e => changePriority(t.id, e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟠 Med</option>
                <option value="low">🟢 Low</option>
              </select>
            </li>
          ))}
        </ul>
        {total > 10 && (
          <button className="btn-sm show-more-btn" onClick={() => setShowAll(v => !v)}>
            {showAll ? 'Show less' : `+${total - 10} more tasks`}
          </button>
        )}
      </div>

      {showAddTask && (
        <AddTaskModal
          scheduleId={s.id}
          onClose={() => setShowAddTask(false)}
          onAdded={onTasksChanged}
        />
      )}
    </div>
  );
}


// ──────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────
export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [streak, setStreak] = useState(null);
  const [studyHours, setStudyHours] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const navigate = useNavigate();

  const load = useCallback(() => {
    api.get('/schedules').then(r => setSchedules(r.data)).catch(() => {});
    api.get('/gamification/streak').then(r => setStreak(r.data)).catch(() => {});
    api.get('/analytics/study-hours?days=7').then(r => setStudyHours(r.data)).catch(() => {});
    api.post('/gamification/log-activity').catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleTask = async (taskId) => {
    await api.put(`/schedules/tasks/${taskId}/toggle`);
    load();
  };

  const deleteSchedule = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    await api.delete(`/schedules/${id}`);
    load();
    toast.success('Schedule deleted');
  };

  // Weekly bar chart data
  const chartLabels = studyHours.map(d => {
    const dt = new Date(d.date);
    return DAY_NAMES[dt.getDay()];
  });
  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Study Hours',
      data: studyHours.map(d => d.hours),
      backgroundColor: 'rgba(111,75,255,0.55)',
      borderRadius: 6,
    }],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.raw}h` } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#aaa' } },
      y: { beginAtZero: true, ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  const allTasks = schedules.flatMap(s => s.tasks || []);
  const goalHours = schedules.length ? schedules[0].hours_per_day : 5;

  return (
    <div className="page">
      <Topbar title="Study Planner" />
      <div className="page-content">

        {/* ── Overview Panel ── */}
        <OverviewPanel schedules={schedules} streak={streak} />

        {/* ── Streak Banner ── */}
        {streak && streak.current_streak > 0 && (
          <div className="streak-banner">
            <FiZap /> 🔥 Study Streak: <strong>{streak.current_streak} days</strong>
            &nbsp; | Longest: <strong>{streak.longest_streak} days</strong>
            &nbsp; | Points: <strong>{streak.total_points}</strong>
            <FiAward />
          </div>
        )}

        {/* ── Header Row ── */}
        <div className="page-header">
          <h3>Your Study Plans</h3>
          <div className="header-right">
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              ><FiList /> List</button>
              <button
                className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              ><FiGrid /> Calendar</button>
            </div>
            <button className="btn-primary" onClick={() => navigate('/schedule/create')}>
              <FiPlus /> Create Schedule
            </button>
          </div>
        </div>

        {/* ── Timer + Chart row ── */}
        <div className="planner-widgets">
          <StudyTimer goal_hours={goalHours} />
          {studyHours.length > 0 && (
            <div className="weekly-chart-card card">
              <div className="timer-header"><FiTrendingUp size={18} /> <span>Weekly Study Hours</span></div>
              <Bar data={chartData} options={chartOptions} height={110} />
            </div>
          )}
        </div>

        {/* ── Calendar or List ── */}
        {viewMode === 'calendar' ? (
          <CalendarView schedules={schedules} onToggle={toggleTask} />
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <FiCalendar size={48} />
            <h3>No schedules yet</h3>
            <p>Create your first study schedule to get started</p>
            <button className="btn-primary" onClick={() => navigate('/schedule/create')}>Create Schedule</button>
          </div>
        ) : (
          schedules.map(s => (
            <ScheduleCard
              key={s.id}
              s={s}
              onToggle={toggleTask}
              onDelete={deleteSchedule}
              onTasksChanged={load}
            />
          ))
        )}
      </div>
    </div>
  );
}
