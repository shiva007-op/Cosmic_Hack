import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    const q = question.toLowerCase();

    try {
      // ===== TODAY =====
      if (q.includes("today")) {
        const res = await api.get("/neos/today");
        const data = res.data;

        const high = data.filter(d => d.risk.level === "High").length;
        const moderate = data.filter(d => d.risk.level === "Moderate").length;

        setAnswer(
          `Today, ${data.length} near-Earth objects are being tracked.
${high} are high risk and ${moderate} are moderate risk.
Most objects are passing safely without threat.`
        );
      }

      // ===== HISTORY =====
      else if (q.includes("last") || q.includes("past")) {
        const res = await api.get("/neos/history?days=7");
        const data = res.data;

        const highest = data.reduce(
          (max, a) => (a.risk.score > max ? a.risk.score : max),
          0
        );

        setAnswer(
          `In the past 7 days, ${data.length} near-Earth objects were recorded.
The highest risk score observed was ${highest}.
No critical impact threats were detected.`
        );
      }

      // ===== CALENDAR =====
      else if (q.includes("month") || q.includes("calendar")) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await api.get(`/neos/calendar?year=${year}&month=${month}`);
        const data = res.data;

        const highDays = new Set(
          data.filter(d => d.risk.level === "High").map(d => d.date)
        );

        setAnswer(
          `For ${now.toLocaleString("default", { month: "long" })} ${year},
there are ${highDays.size} days with high-risk near-Earth objects.
All other days are considered low to moderate risk.`
        );
      }

      // ===== DEFAULT =====
      else {
        setAnswer(
          "I can help with asteroid risks, history, and calendar analysis.\nTry asking:\n• Is there any danger today?\n• What happened last week?\n• Which days are risky this month?"
        );
      }
    } catch (err) {
      setAnswer("⚠️ Unable to fetch space data at the moment.");
    }

    setLoading(false);
  };

  return (
    <div className="layout">
      <Header />
      <div className="content">
        <Sidebar />

        <main className="main">
          <h2>🤖 AI Assistant</h2>
          <p>Ask about asteroid risks, history, or calendar insights.</p>

          <div className="ai-box">
            <input
              type="text"
              placeholder="Ask a question about near-Earth objects..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={askAI}>Ask</button>
          </div>

          {loading && <div className="loading">Thinking…</div>}

          {answer && (
            <div className="ai-answer">
              <pre>{answer}</pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
