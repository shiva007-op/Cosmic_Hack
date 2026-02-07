import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Overview", path: "/", icon: "📊" },
  { label: "History", path: "/history", icon: "🕒" },
  { label: "Calendar", path: "/calendar", icon: "📅" },
  { label: "AI Assistant", path: "/ai", icon: "🤖" },
  { label: "Resources", path: "/resources", icon: "📚" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.path}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
