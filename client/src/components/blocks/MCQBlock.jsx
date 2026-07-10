import { useState } from "react";

export default function MCQBlock({ question, options = [], answer, explanation, index }) {
  const [selected, setSelected] = useState(null);

  const getStyle = (i) => {
    if (selected === null)
      return {
        background: "var(--bg-app)",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      };
    if (i === answer)
      return {
        background: "var(--success)18",
        borderColor: "var(--success)",
        color: "var(--success)",
      };
    if (i === selected)
      return {
        background: "var(--error)18",
        borderColor: "var(--error)",
        color: "var(--error)",
      };
    return {
      background: "var(--bg-surface)",
      borderColor: "var(--border)",
      color: "var(--text-tertiary)",
      opacity: 0.5,
    };
  };

  return (
    <div
      className="p-6 rounded-xl border"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          QUIZ
        </span>
        {selected !== null && (
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full"
            style={
              selected === answer
                ? { background: "var(--success)18", color: "var(--success)" }
                : { background: "var(--error)18", color: "var(--error)" }
            }
          >
            {selected === answer ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      {/* Question */}
      <p
        className="font-display text-base font-semibold mb-5 leading-snug"
        style={{ color: "var(--text-primary)" }}
      >
        {question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selected === null && setSelected(i)}
            disabled={selected !== null}
            className="w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 font-body text-sm"
            style={getStyle(i)}
          >
            <span className="font-mono text-xs mr-2.5" style={{ opacity: 0.6 }}>
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {selected !== null && explanation && (
        <div
          className="mt-5 p-4 rounded-lg font-body text-sm leading-relaxed"
          style={{
            background: "var(--accent-muted)",
            borderLeft: "3px solid var(--accent)",
            color: "var(--text-primary)",
          }}
        >
          {explanation}
        </div>
      )}

      {/* Reset */}
      {selected !== null && (
        <button
          onClick={() => setSelected(null)}
          className="mt-4 font-mono text-xs transition-opacity"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          Try again
        </button>
      )}
    </div>
  );
}