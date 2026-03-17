import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  READINESS_EMPTY_CONFIDENCE_COLOR,
  READINESS_LEVEL_COLORS,
  READINESS_LEVELS,
} from '../../config/pageConstants';

export default function Readiness() {
  const [checkins, setCheckins] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject: '', confidence_level: 3, notes: '' });

  useEffect(() => { load(); }, []);
  const load = () => {
    api.get('/readiness').then(r => setCheckins(r.data));
    api.get('/readiness/summary').then(r => setSummary(r.data));
  };

  const addCheckin = async (e) => {
    e.preventDefault();
    await api.post('/readiness', form);
    toast.success('Check-in recorded!');
    setShowAdd(false);
    setForm({ subject: '', confidence_level: 3, notes: '' });
    load();
  };

  return (
    <div className="page">
      <Topbar title="Readiness Check-in" />
      <div className="page-content">
        {summary && (
          <div className="readiness-overview">
            <div className="card readiness-score">
              <h3>Overall Readiness</h3>
              <div className="readiness-gauge">
                <div className="gauge-value" style={{ color: READINESS_LEVEL_COLORS[Math.round(summary.overall_readiness)] }}>
                  {summary.overall_readiness.toFixed(1)}/5
                </div>
                <div className="gauge-bar">
                  <div className="gauge-fill" style={{ width: `${summary.overall_readiness / 5 * 100}%`, background: READINESS_LEVEL_COLORS[Math.round(summary.overall_readiness)] }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="page-header">
          <h3>Subject Confidence</h3>
          <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}><FiPlus /> New Check-in</button>
        </div>

        {showAdd && (
          <div className="card form-card">
            <form onSubmit={addCheckin} className="create-form">
              <div className="form-group">
                <label>Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Confidence Level: {READINESS_LEVELS[form.confidence_level]}</label>
                <input type="range" min="0" max="5" value={form.confidence_level} onChange={e => setForm({...form, confidence_level: parseInt(e.target.value)})} />
                <div className="range-labels">{READINESS_LEVELS.map((l, i) => <span key={i} style={{ color: READINESS_LEVEL_COLORS[i] }}>{l}</span>)}</div>
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        )}

        {summary?.subjects && (
          <div className="confidence-grid">
            {summary.subjects.map((s, i) => (
              <div key={i} className="card confidence-card">
                <h4>{s.subject}</h4>
                <div className="confidence-bar-container">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className={`conf-block ${n <= s.confidence ? 'filled' : ''}`}
                      style={{ background: n <= s.confidence ? READINESS_LEVEL_COLORS[s.confidence] : READINESS_EMPTY_CONFIDENCE_COLOR }} />
                  ))}
                </div>
                <span className="conf-label" style={{ color: READINESS_LEVEL_COLORS[s.confidence] }}>
                  {READINESS_LEVELS[s.confidence]}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <h3>Recent Check-ins</h3>
          <div className="checkin-list">
            {checkins.slice(0, 10).map(c => (
              <div key={c.id} className="checkin-item">
                <span className="checkin-subject">{c.subject}</span>
                <span className="checkin-conf" style={{ color: READINESS_LEVEL_COLORS[c.confidence_level] }}>
                  {READINESS_LEVELS[c.confidence_level]}
                </span>
                <span className="checkin-date">{new Date(c.checked_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
