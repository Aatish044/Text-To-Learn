import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCourse } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await generateCourse(topic.trim());
      navigate(`/course/${data._id}`);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        "Failed to generate course. Check your API key and server."
      );
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-app)" }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-32">
        <div className="text-center mb-14 fade-in">
          {firstName && (
            <p className="font-body text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
              Welcome back, {firstName}
            </p>
          )}
          <h2
            className="font-display text-4xl font-semibold leading-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            What do you want to learn today?
          </h2>
          <p className="font-body text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Type a subject below and get structured modules, lessons,
            quizzes, code examples & video suggestions.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="fade-in">
          <div
            className="flex gap-2 p-2 rounded-2xl border"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='"Intro to React Hooks" or "Basics of Machine Learning"'
              className="flex-1 bg-transparent px-4 py-3 font-body text-base outline-none"
              style={{ color: "var(--text-primary)", caretColor: "var(--accent)" }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-7 py-3 rounded-xl font-body font-semibold text-sm transition-all duration-200 whitespace-nowrap"
              style={{
                background: loading ? "var(--bg-elevated)" : "var(--accent)",
                color: loading ? "var(--text-tertiary)" : "#1b1a18",
                cursor: loading || !topic.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Generating…
                </span>
              ) : (
                "Generate course →"
              )}
            </button>
          </div>

          {loading && (
            <p className="text-center font-mono text-xs mt-3" style={{ color: "var(--accent)", opacity: 0.8 }}>
              Designing your curriculum… this may take 15–30 seconds
            </p>
          )}
          {error && (
            <p className="text-center font-mono text-xs mt-3" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}