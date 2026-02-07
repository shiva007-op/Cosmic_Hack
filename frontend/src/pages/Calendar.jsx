import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1–12
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    setLoading(true);
    api
      .get(`/neos/calendar?year=${year}&month=${month}`)
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Calendar API error:", err);
        setLoading(false);
      });
  }, [year, month]);

  /* ================= DATE HELPERS ================= */
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();

  const formatDateKey = (day) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const groupedByDate = data.reduce((acc, neo) => {
    acc[neo.date] = acc[neo.date] || [];
    acc[neo.date].push(neo);
    return acc;
  }, {});

  const getRiskClass = (dateKey) => {
    const items = groupedByDate[dateKey];
    if (!items) return "low"; // no data = safe day

    if (items.some((i) => i.risk.level === "High")) return "high";
    if (items.some((i) => i.risk.level === "Moderate")) return "moderate";
    return "low";
  };

  const changeMonth = (dir) => {
    if (dir === "prev") {
      if (month === 1) {
        setMonth(12);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else {
      if (month === 12) {
        setMonth(1);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="layout">
      <Header />

      <div className="content">
        <Sidebar />

        <main className="main">
          {/* ===== HEADER ===== */}
          <div className="calendar-header">
            <button onClick={() => changeMonth("prev")}>◀</button>

            <h2>
              {new Date(year, month - 1).toLocaleString("default", {
                month: "long",
              })}{" "}
              {year}
            </h2>

            <button onClick={() => changeMonth("next")}>▶</button>
          </div>

          {/* ===== WEEK DAYS ===== */}
          <div className="calendar-weekdays">
            {WEEK_DAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* ===== GRID ===== */}
          {loading ? (
            <div className="loading">📅 Loading calendar data…</div>
          ) : (
            <div className="calendar-grid">
              {/* Empty slots before month start */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = formatDateKey(day);
                const riskClass = getRiskClass(dateKey);

                return (
                  <div
                    key={dateKey}
                    className={`calendar-day ${riskClass}`}
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    <span className="day-number">{day}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== DETAILS ===== */}
          {selectedDate && (
            <section className="calendar-details">
              <h3>📍 {selectedDate}</h3>

              {groupedByDate[selectedDate]?.length ? (
                groupedByDate[selectedDate].map((neo) => (
                  <div
                    key={neo.id}
                    className={`neo-card ${neo.risk.level.toLowerCase()}`}
                  >
                    <div className="neo-header">
                      <h3>{neo.name}</h3>
                      <span
                        className={`neo-badge ${neo.risk.level.toLowerCase()}`}
                      >
                        {neo.risk.level}
                      </span>
                    </div>

                    <div className="neo-info">
                      <p>📏 Diameter: {neo.diameter_m} m</p>
                      <p>🚀 Velocity: {neo.velocity_km_s} km/s</p>
                      <p>
                        🌍 Miss Distance:{" "}
                        {neo.miss_distance_km.toLocaleString()} km
                      </p>
                      <p>⚠ Risk Score: {neo.risk.score}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Near-Earth Objects on this date.</p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
