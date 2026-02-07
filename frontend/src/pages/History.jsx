import { useEffect, useState } from "react";
import { api } from "../services/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/neos/history?days=7")
      .then((res) => {
        setHistory(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("History API error:", err);
        setError("Failed to load history data");
        setLoading(false);
      });
  }, []);

  // Group asteroids by date
  const groupedByDate = history.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="layout">
      <Header />

      <div className="content">
        <Sidebar />

        <main className="main">
          <h2 style={{ marginBottom: "6px" }}>🕒 History</h2>
          <p style={{ opacity: 0.75, marginBottom: "24px" }}>
            Past Near-Earth Object encounters (last 7 days)
          </p>

          {/* Loading */}
          {loading && (
            <div className="loading">
              ⏳ Loading historical NEO data...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Timeline */}
          {!loading && !error && Object.keys(groupedByDate).length === 0 && (
            <p>No historical data available.</p>
          )}

          {!loading &&
            !error &&
            Object.entries(groupedByDate)
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, items]) => (
                <section key={date} style={{ marginBottom: "36px" }}>
                  <h3
                    style={{
                      marginBottom: "14px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      paddingBottom: "6px",
                    }}
                  >
                    📅 {date}
                  </h3>

                  <div className="grid">
                    {items.map((neo) => (
                      <div
                        key={neo.id}
                        className={`neo-card ${neo.risk.level.toLowerCase()}`}
                      >
                        <div className="neo-header">
                          <h3>{neo.name}</h3>
                          <span
                            className={`neo-badge ${neo.risk.level.toLowerCase()}`}
                          >
                            {neo.risk.level} Risk
                          </span>
                        </div>

                        <div className="neo-metrics">
                          <div>
                            <div className="metric-value">
                              {neo.diameter_m} m
                            </div>
                            <div className="metric-label">Diameter</div>
                          </div>

                          <div>
                            <div className="metric-value">
                              {neo.velocity_km_s} km/s
                            </div>
                            <div className="metric-label">Velocity</div>
                          </div>
                        </div>

                        <div className="neo-info">
                          <p>
                            🌍 Miss Distance:{" "}
                            {neo.miss_distance_km.toLocaleString()} km
                          </p>
                          <p>⚠️ Risk Score: {neo.risk.score}</p>
                        </div>

                        <div className="neo-footer">
                          Close Approach Date: {neo.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
        </main>
      </div>
    </div>
  );
}
