import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ background: "rgba(27,26,24,0.9)", borderColor: "var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-lg tracking-tight font-display"
          style={{ color: "var(--text-primary)" }}
        >
          Just<span style={{ color: "var(--accent)" }}>Text</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="transition"
            style={{
              color: location.pathname === "/" ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            Home
          </Link>

          <Link
  to="/courses"
  className="transition"
  style={{
    color: location.pathname === "/courses" ? "var(--accent)" : "var(--text-secondary)",
  }}
>
  Courses
</Link>
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition"
            style={{ background: "var(--accent-muted)", color: "var(--text-primary)" }}
          >
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg border shadow-lg fade-in overflow-hidden"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {user?.name}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm transition"
                style={{ color: "var(--error)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}