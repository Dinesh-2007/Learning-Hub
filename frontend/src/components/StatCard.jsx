export default function StatCard({ icon, label, value, sub, trend, color = 'var(--accent)' }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color }}>
      <div className="stat-icon" style={{ background: `${color}22`, color }}>{icon}</div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trend.direction === 'down' ? 'down' : 'up'}`}>
            {trend.direction === 'down' ? '▼' : '▲'} {trend.text}
          </span>
        )}
        <span className="stat-label">{label}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}
