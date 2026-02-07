export default function AsteroidCard({ asteroid, delay }) {
  const risk = asteroid.risk.level.toLowerCase();

  return (
    <div
      className={`neo-card ${risk}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="neo-header">
        <h3>{asteroid.name}</h3>
        <span className={`neo-badge ${risk}`}>
          {asteroid.risk.level}
        </span>
      </div>

      {/* Main metrics */}
      <div className="neo-metrics">
        <div>
          <span className="metric-value">{asteroid.diameter_m} m</span>
          <span className="metric-label">Diameter</span>
        </div>
        <div>
          <span className="metric-value">{asteroid.velocity_km_s} km/s</span>
          <span className="metric-label">Velocity</span>
        </div>
      </div>

      {/* Secondary info */}
      <div className="neo-info">
        <p>🌍 Miss Distance: {asteroid.miss_distance_km.toLocaleString()} km</p>
        <p>📅 Close Approach: {asteroid.close_approach_date}</p>
      </div>

      {/* Footer */}
      <div className="neo-footer">
        ⚠ Risk Score: <b>{asteroid.risk.score}</b>
      </div>
    </div>
  );
}
