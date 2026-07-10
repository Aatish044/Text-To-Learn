import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const { data } = await loginUser(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-6"
      style={{ background: "var(--bg-app)" }}
    >
      <div
        className="w-full max-w-[380px] p-8 rounded-2xl border fade-in"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <Link
          to="/"
          className="block text-center text-lg font-display mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          Just<span style={{ color: "var(--accent)" }}>Text</span>
        </Link>

        <h1
          className="font-display text-2xl font-semibold text-center mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full rounded-lg p-3 font-body text-sm outline-none border transition"
            style={{
              background: "var(--bg-app)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />

          <input
            className="w-full rounded-lg p-3 font-body text-sm outline-none border transition"
            style={{
              background: "var(--bg-app)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />

          {error && (
            <p className="font-mono text-xs" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg p-3 font-body font-semibold text-sm transition-all"
            style={{
              background: loading ? "var(--bg-elevated)" : "var(--accent)",
              color: loading ? "var(--text-tertiary)" : "#1b1a18",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm" style={{ color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold" style={{ color: "var(--accent)" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}