// components/StatCard.jsx
export default function StatCard({ title, value, unit, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <h4>{title}</h4>
      <div className="stat-value">
        <span style={{ color }}>{value}</span>
        <span className="stat-unit">{unit}</span>
      </div>
    </div>
  );
}
