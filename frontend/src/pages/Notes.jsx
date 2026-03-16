import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiPlus, FiEdit2, FiTrash2, FiBookmark, FiSearch, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { ROUTE_PATHS } from '../config/routeConfig';

export default function Notes() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLearningResources = Boolean(location.state?.fromLearningResources);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, bookmarked
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', subject: '', tags: '' });

  useEffect(() => { load(); }, [filter]);
  const load = () => {
    const params = filter === 'bookmarked' ? '?bookmarked=true' : '';
    api.get(`/notes${params}`).then(r => setNotes(r.data));
  };

  const createNote = async (e) => {
    e.preventDefault();
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editing) {
      await api.put(`/notes/${editing}`, data);
      toast.success('Note updated!');
    } else {
      await api.post('/notes', data);
      toast.success('Note created!');
    }
    setEditing(null);
    setForm({ title: '', content: '', subject: '', tags: '' });
    load();
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    toast.success('Note deleted');
    load();
  };

  const toggleBookmark = async (note) => {
    await api.put(`/notes/${note.id}`, { is_bookmarked: !note.is_bookmarked });
    load();
  };

  const editNote = (note) => {
    setEditing(note.id);
    setForm({ title: note.title, content: note.content, subject: note.subject, tags: (note.tags || []).join(', ') });
  };

  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <Topbar title="Notes" />
      <div className="page-content">
        {fromLearningResources && (
          <button className="btn-back" onClick={() => navigate(ROUTE_PATHS.learningResources)}>
            <FiArrowLeft /> Back to Learning Resources
          </button>
        )}
        <div className="page-header">
          <div className="filter-bar">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Notes</button>
            <button className={`filter-btn ${filter === 'bookmarked' ? 'active' : ''}`} onClick={() => setFilter('bookmarked')}><FiBookmark /> Bookmarked</button>
          </div>
          <button className="btn-primary" onClick={() => { setEditing(null); setForm({ title: '', content: '', subject: '', tags: '' }); }}>
            <FiPlus /> New Note
          </button>
        </div>

        <div className="search-filter">
          <FiSearch />
          <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="notes-layout">
          <div className="notes-list-panel">
            {filtered.map(n => (
              <div key={n.id} className={`note-item ${editing === n.id ? 'active' : ''}`}>
                <div className="note-item-header" onClick={() => editNote(n)}>
                  <h4>{n.title}</h4>
                  <div className="note-item-actions">
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(n); }} className={n.is_bookmarked ? 'bookmarked' : ''}>
                      <FiBookmark />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }}><FiTrash2 /></button>
                  </div>
                </div>
                {n.subject && <span className="note-subject">{n.subject}</span>}
                <p className="note-preview">{n.content?.substring(0, 100)}...</p>
                <span className="note-date">{new Date(n.updated_at).toLocaleDateString()}</span>
              </div>
            ))}
            {filtered.length === 0 && <p className="empty-text">No notes yet</p>}
          </div>

          <div className="note-editor-panel card">
            <h3>{editing ? 'Edit Note' : 'New Note'}</h3>
            <form onSubmit={createNote} className="create-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
                <div className="form-group"><label>Tags</label>
                  <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={12} className="note-textarea" />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editing ? 'Update Note' : 'Create Note'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
