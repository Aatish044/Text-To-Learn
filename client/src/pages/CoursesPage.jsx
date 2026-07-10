import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, deleteCourse } from "../utils/api";
import Navbar from "../components/Navbar";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-app)" }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1
          className="font-display text-3xl font-semibold mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          Your courses
        </h1>

        {fetching ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : courses.length > 0 ? (
          <div className="fade-in">
            <p className="font-mono text-xs mb-5" style={{ color: "var(--text-tertiary)" }}>
              {courses.length} {courses.length === 1 ? "course" : "courses"}
            </p>

            <div className="grid gap-3">
              {courses.map((course) => {
                const totalLessons = course.modules?.reduce(
                  (s, m) => s + (m.lessons?.length || 0),
                  0
                );
                return (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="group p-5 rounded-xl border cursor-pointer transition-all duration-200"
                    style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-display text-lg font-semibold truncate mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {course.title}
                        </h4>
                        <p
                          className="font-body text-sm line-clamp-2 mb-3"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {course.description}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>
                            {course.modules?.length || 0} modules · {totalLessons || 0} lessons
                          </span>
                          {course.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded font-mono"
                              style={{ background: "var(--accent-muted)", color: "var(--text-primary)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(course._id, e)}
                        aria-label={`Delete ${course.title}`}
                        className="shrink-0 opacity-0 group-hover:opacity-100 font-mono text-xs px-3 py-1.5 rounded border transition-all"
                        style={{ color: "var(--error)", borderColor: "var(--error)", background: "transparent" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-2xl border fade-in"
            style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
          >
            <p className="font-display text-xl mb-2" style={{ color: "var(--text-secondary)" }}>
              No courses yet
            </p>
            <p className="font-body text-sm" style={{ color: "var(--text-tertiary)" }}>
              Generate your first course from the home page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}