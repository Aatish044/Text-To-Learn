import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse } from "../utils/api";
import Navbar from "../components/Navbar";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    getCourse(id)
      .then(({ data }) => setCourse(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--bg-app)" }}
        >
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="font-body text-sm" style={{ color: "var(--text-tertiary)" }}>
              Loading course…
            </p>
          </div>
        </div>
      </>
    );

  if (!course)
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--bg-app)" }}
        >
          <div className="text-center">
            <p className="font-mono text-sm mb-4" style={{ color: "var(--error)" }}>
              Course not found.
            </p>
            <Link to="/" className="font-mono text-sm" style={{ color: "var(--accent)" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    );

  const totalLessons = course.modules.reduce(
    (s, m) => s + (m.lessons?.length || 0),
    0
  );
  const enrichedCount = course.modules.reduce(
    (s, m) => s + (m.lessons?.filter((l) => l.isEnriched).length || 0),
    0
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: "var(--bg-app)" }}>
        <div className="max-w-3xl mx-auto px-6 py-14 fade-in">
          <div className="mb-12 pb-10 border-b" style={{ borderColor: "var(--border)" }}>
            {course.tags?.length > 0 && (
              <div className="flex gap-2 mb-5 flex-wrap">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full font-mono"
                    style={{ background: "var(--accent-muted)", color: "var(--text-primary)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <Link to="/" className="font-mono text-sm" style={{ color: "var(--accent)" }}>
                ← Home
              </Link>
              <span style={{ color: "var(--border)" }}>/</span>
              <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
                Course
              </span>
            </div>

            <h1
              className="font-display text-4xl font-bold leading-tight mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              {course.title}
            </h1>
            <p
              className="font-body text-lg leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              {course.description}
            </p>

            <div className="flex items-center gap-6">
              <Stat label="Modules" value={course.modules.length} />
              <Stat label="Lessons" value={totalLessons} />
              <Stat label="Generated" value={`${enrichedCount}/${totalLessons}`} accent />
            </div>
          </div>

          <div>
            <h2
              className="font-display text-2xl font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Course curriculum
            </h2>

            <div className="space-y-3">
              {course.modules.map((mod, i) => (
                <ModuleAccordion
                  key={mod._id}
                  mod={mod}
                  index={i}
                  isOpen={openModule === i}
                  onToggle={() => setOpenModule(openModule === i ? -1 : i)}
                  onLessonClick={(lessonId) => navigate(`/lesson/${lessonId}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <p className="font-mono text-xs mb-0.5" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </p>
      <p
        className="font-display text-xl font-bold"
        style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

function ModuleAccordion({ mod, index, isOpen, onToggle, onLessonClick }) {
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{
        borderColor: isOpen ? "var(--accent)" : "var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      <button onClick={onToggle} className="w-full px-5 py-4 flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shrink-0"
            style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
          >
            {index + 1}
          </span>
          <span className="font-display font-semibold" style={{ color: "var(--text-primary)" }}>
            {mod.title}
          </span>
          <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
            {mod.lessons?.length} lessons
          </span>
        </div>
        <span style={{ color: "var(--accent)", fontSize: "1.1rem" }}>{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="space-y-1.5 mt-3">
            {mod.lessons?.map((lesson, j) => (
              <button
                key={lesson._id}
                onClick={() => onLessonClick(lesson._id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-150"
                style={{ background: "var(--bg-app)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-app)")}
              >
                <span className="font-mono text-xs w-5 shrink-0" style={{ color: "var(--text-tertiary)" }}>
                  {j + 1}.
                </span>
                <span className="flex-1 font-body text-sm" style={{ color: "var(--text-secondary)" }}>
                  {lesson.title}
                </span>
                <span
                  className="shrink-0 text-xs font-mono px-2.5 py-0.5 rounded-full"
                  style={
                    lesson.isEnriched
                      ? { background: "var(--success)", color: "var(--bg-app)" }
                      : { background: "var(--accent-muted)", color: "var(--accent)" }
                  }
                >
                  {lesson.isEnriched ? "Ready" : "Generate"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}