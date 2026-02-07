import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Calendar from "./pages/Calendar";
import AIAssistant from "./pages/AIAssistant";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Dashboard />} />

        {/* Core Features */}
        <Route path="/history" element={<History />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/ai" element={<AIAssistant />} />

        {/* Fallback (optional but recommended) */}
        <Route
          path="*"
          element={
            <div style={{ padding: 40, color: "white" }}>
              <h2>404</h2>
              <p>Page not found</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
