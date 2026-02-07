import { useEffect, useState } from "react";
import { api } from "../services/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AsteroidCard from "../components/AsteroidCard";

export default function Dashboard() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/neos/today")
      .then((res) => {
        setAsteroids(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">☄️ Scanning near-Earth space...</div>;
  }

  const highRiskCount = asteroids.filter(
    (a) => a?.risk?.level === "High"
  ).length;

  return (
    <div className="layout">
      <Header />

      <div className="content">
        <Sidebar />

        <main className="main">
          {/* ================= HERO ================= */}
          <section className="hero">
            <div className="orbit"></div>
            <div className="orbit small"></div>

            <div className="hero-title">
              🌍 Near-Earth Object Monitoring
              <br />
              Live Orbital Activity
            </div>
          </section>

          {/* ================= ASTEROID GRID ================= */}
          <section className="grid">
            {asteroids.map((asteroid, index) => (
              <AsteroidCard
                key={asteroid.id || index}
                asteroid={asteroid}
                delay={index * 80}
              />
            ))}
          </section>

          {/* ================= FOOTER STATS ================= */}
          <section className="footer-stats">
            <div>
              <h3>{asteroids.length}</h3>
              <span>Objects Tracked Today</span>
            </div>

            <div>
              <h3>{highRiskCount}</h3>
              <span>High-Risk Objects</span>
            </div>

            <div>
              <h3>NASA</h3>
              <span>Data Source</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
