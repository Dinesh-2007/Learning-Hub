import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';
import { FiPlus, FiTrash2, FiExternalLink, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { MOCK_RESOURCES } from '../../data/resourceMock';

const CATEGORIES = ['all', 'notes', 'coding', 'aptitude', 'interview', 'general'];
const TYPE_ICONS = { link: '🔗', pdf: '📄', note: '📝', video: '🎥' };

function resolveResourceLink(resource) {
  const raw = (resource.url || '').trim();
  if (raw) {
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }

  const query = encodeURIComponent([resource.title, resource.subject].filter(Boolean).join(' '));
  return `https://www.google.com/search?q=${query}`;
}

export default function ResourceHub() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', resource_type: 'link', category: 'general', subject: '', url: '', tags: '' });

  useEffect(() => { load(); }, []);
  const load = () => {
    api.get('/resources/')
      .then(r => setResources(r.data && r.data.length ? r.data : MOCK_RESOURCES))
      .catch(() => setResources(MOCK_RESOURCES));
  };

  const addResource = async (e) => {
    e.preventDefault();
    await api.post('/resources/', { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    toast.success('Resource added!');
    setShowAdd(false);
    setForm({ title: '', description: '', resource_type: 'link', category: 'general', subject: '', url: '', tags: '' });
    load();
  };

  const deleteResource = async (id) => {
    await api.delete(`/resources/${id}`);
    toast.success('Resource deleted');
    load();
  };

  const filtered = resources
    .filter(r => filter === 'all' || r.category === filter)
    .filter(r => {
      const q = search.toLowerCase();
      const tags = (r.tags || []).join(' ').toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        (r.subject || '').toLowerCase().includes(q) ||
        tags.includes(q)
      );
    });

  return (
    <div className="page">
      <Topbar title="Resource Hub" />
      <div className="page-content">
        <div className="page-header">
          <div className="filter-bar">
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}><FiPlus /> Add Resource</button>
        </div>

        {showAdd && (
          <div className="card form-card">
            <h3>Add New Resource</h3>
            <form onSubmit={addResource} className="create-form">
              <div className="form-row">
                <div className="form-group"><label>Title</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
                <div className="form-group"><label>Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="e.g., Data Structures" /></div>
              </div>
              <div className="form-group"><label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
              <div className="form-row">
                <div className="form-group"><label>Type</label>
                  <select value={form.resource_type} onChange={e => setForm({...form, resource_type: e.target.value})}>
                    <option value="link">Link</option><option value="pdf">PDF</option><option value="note">Note</option><option value="video">Video</option>
                  </select></div>
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
              </div>
              <div className="form-group"><label>URL</label>
                <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." /></div>
              <div className="form-group"><label>Tags (comma-separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Resource</button>
              </div>
            </form>
          </div>
        )}

        <div className="search-filter">
          <FiSearch />
          <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="resource-grid">
          {filtered.map(r => (
            <div key={r.id} className="card resource-card">
              {(() => {
                const resourceLink = resolveResourceLink(r);
                return (
                  <>
              <div className="resource-header">
                <span className="resource-type-icon">{TYPE_ICONS[r.resource_type] || '📎'}</span>
                <span className={`resource-category ${r.category}`}>{r.category}</span>
              </div>
              <h4>
                <a href={resourceLink} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {r.title}
                </a>
              </h4>
              <p className="resource-desc">{r.description}</p>
              {r.subject && <span className="resource-subject">{r.subject}</span>}
              <div className="resource-tags">
                {(r.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
              <div className="resource-actions">
                <a href={resourceLink} target="_blank" rel="noreferrer" className="btn-sm"><FiExternalLink /> Open</a>
                <button className="btn-sm danger" onClick={() => deleteResource(r.id)}><FiTrash2 /></button>
              </div>
                  </>
                );
              })()}
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state"><p>No resources found</p></div>}
      </div>
    </div>
  );
}
