import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson, generateLesson } from "../utils/api";
import { useFetch } from "../hooks/useFetch";
import LessonRenderer from "../components/LessonRenderer";
import Navbar from "../components/Navbar";

export default function LessonPage() {
  const { id } = useParams();
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState("");
  const contentRef = useRef(null);

  const { data: lesson, setData: setLesson, loading, error: loadError } = useFetch(
    () => getLesson(id),
    [id]
  );

  const handleGenerate = async () => {
    setGenerating(true);
    setActionError("");
    try {
      const { data } = await generateLesson(id);
      setLesson(data);
    } catch (e) {
      setActionError(e?.response?.data?.error || "Generation failed. Check your API key.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePDF = async () => {
    if (!contentRef.current) return;
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-surface")
        .trim();

      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: bgColor || "#242320",
        scale: 2,
        useCORS: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      while (position < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, imgHeight);
        position += pageHeight;
        if (position < imgHeight) pdf.addPage();
      }

      pdf.save(`${lesson.title}.pdf`);
    } catch (e) {
      setActionError("PDF export failed.");
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-app)" }}>
          <div className="spinner" />
        </div>
      </>
    );

  if (!lesson || loadError)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-app)" }}>
          <div className="text-center">
            <p className="font-mono text-sm mb-4" style={{ color: "var(--error)" }}>
              {loadError || "Lesson not found."}
            </p>
            <Link to="/" className="font-mono text-sm" style={{ color: "var(--accent)" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    );

  const courseId = lesson.module?.course?._id;

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: "var(--bg-app)" }}>
        <main className="max-w-2xl mx-auto px-6 py-14 fade-in">
          {/* Back button — top-left, replaces breadcrumb */}
          {courseId && (
            <Link
              to={`/course/${courseId}`}
              className="inline-flex items-center gap-1.5 font-mono text-sm mb-8"
              style={{ color: "var(--accent)" }}
            >
              ← Back to course
            </Link>
          )}

          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--accent)" }}>
            {lesson.module?.title?.toUpperCase()}
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight mb-8" style={{ color: "var(--text-primary)" }}>
            {lesson.title}
          </h1>

          {/* Action bar — only shown once content exists; first-time generate lives in EmptyState below */}
          {lesson.isEnriched && (
            <div className="flex items-center gap-3 mb-10 flex-wrap">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-5 py-2 rounded-lg border font-mono text-sm transition-all"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface)",
                  opacity: generating ? 0.5 : 1,
                  cursor: generating ? "not-allowed" : "pointer",
                }}
              >
                {generating ? "Regenerating…" : "Regenerate"}
              </button>

              <button
                onClick={handlePDF}
                disabled={exporting}
                className="px-5 py-2 rounded-lg border font-mono text-sm transition-all"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  background: "transparent",
                  opacity: exporting ? 0.5 : 1,
                  cursor: exporting ? "not-allowed" : "pointer",
                }}
              >
                {exporting ? "Exporting…" : "Export PDF"}
              </button>
            </div>
          )}

          {lesson.objectives?.length > 0 && (
            <div className="mb-10 p-5 rounded-xl border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <p className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--accent)" }}>
                LEARNING OBJECTIVES
              </p>
              <ul className="space-y-2">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-2.5 font-body text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--success)", flexShrink: 0 }}>•</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actionError && (
            <div
              className="mb-6 p-4 rounded-lg border font-mono text-sm"
              style={{ borderColor: "var(--error)", background: "transparent", color: "var(--error)" }}
            >
              {actionError}
            </div>
          )}

          {lesson.isEnriched ? (
            <div ref={contentRef}>
              <LessonRenderer content={lesson.content} />
            </div>
          ) : (
            <EmptyState onGenerate={handleGenerate} generating={generating} />
          )}
        </main>
      </div>
    </>
  );
}

function EmptyState({ onGenerate, generating }) {
  return (
    <div className="text-center py-24 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
      <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Lesson not yet generated
      </h3>
      <p className="font-body text-sm mb-10" style={{ color: "var(--text-tertiary)" }}>
        Generate the full lesson content, quizzes, and code examples.
      </p>
      <button
        onClick={onGenerate}
        disabled={generating}
        className="px-10 py-4 rounded-xl font-body text-lg font-semibold transition-all"
        style={{
          background: generating ? "var(--bg-elevated)" : "var(--accent)",
          color: generating ? "var(--text-tertiary)" : "#1b1a18",
        }}
      >
        {generating ? (
          <span className="flex items-center gap-3">
            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            Writing your lesson…
          </span>
        ) : (
          "Generate lesson content"
        )}
      </button>
      {generating && (
        <p className="font-mono text-xs mt-5" style={{ color: "var(--accent)", opacity: 0.7 }}>
          Crafting headings, paragraphs, code, quizzes… ~20 seconds
        </p>
      )}
    </div>
  );
}