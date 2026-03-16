import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ScheduleCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', exam_date: '', subjects: '', hours_per_day: 4, priority_subjects: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const subjects = form.subjects.split(',').map(s => s.trim()).filter(Boolean);
      const priority = form.priority_subjects.split(',').map(s => s.trim()).filter(Boolean);
      const examDate = new Date(form.exam_date);

      if (!form.exam_date || Number.isNaN(examDate.getTime())) {
        toast.error('Please select a valid exam date.');
        setLoading(false);
        return;
      }

      if (subjects.length === 0) {
        toast.error('Please enter at least one subject.');
        setLoading(false);
        return;
      }
      
      await api.post('/schedules/auto-generate', {
        title: form.title,
        exam_date: examDate.toISOString(),
        subjects,
        hours_per_day: parseFloat(form.hours_per_day),
        priority_subjects: priority
      });
      toast.success('Schedule generated!');
      navigate('/schedule');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map(d => d.msg).join(', ')
        : detail || err.message || 'Failed to create schedule';
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <Topbar title="Create Study Schedule" />
      <div className="page-content">
        <div className="card form-card">
          <h3>🗓️ Auto-Generate Study Schedule</h3>
          <p className="form-desc">Enter your exam details and subjects to automatically generate a structured study plan.</p>
          
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-group">
              <label>Schedule Title</label>
              <input type="text" placeholder="e.g., Mid-Semester Exam Prep" value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Exam/Deadline Date</label>
                <input type="date" value={form.exam_date} 
                  onChange={e => setForm({...form, exam_date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Study Hours Per Day</label>
                <input type="number" min="1" max="12" step="0.5" value={form.hours_per_day}
                  onChange={e => setForm({...form, hours_per_day: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Subjects (comma-separated)</label>
              <input type="text" placeholder="e.g., Data Structures, DBMS, OS, Networks"
                value={form.subjects} onChange={e => setForm({...form, subjects: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Priority Subjects (comma-separated, optional)</label>
              <input type="text" placeholder="e.g., Data Structures, DBMS"
                value={form.priority_subjects} onChange={e => setForm({...form, priority_subjects: e.target.value})} />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/schedule')}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
