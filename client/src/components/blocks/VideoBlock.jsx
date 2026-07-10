export default function VideoBlock({ query }) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  return (
    <div
      className="flex items-center gap-4 p-5 rounded-xl border"
      style={{ background: "#13110f", borderColor: "#26221e" }}
    >
      {/* YouTube icon */}
      <a
        href={searchUrl}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
        style={{ background: "#ff0000" }}
        aria-label="Search on YouTube"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
        </svg>
      </a>

      <div>
        <p
          className="font-mono text-xs mb-1.5 tracking-widest"
          style={{ color: "#d4843a" }}
        >
          SUGGESTED VIDEO
        </p>
        <p className="font-body text-sm mb-2" style={{ color: "#f0d9a8" }}>
          {query}
        </p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs hover:underline transition-opacity hover:opacity-100"
          style={{ color: "#d4843a", opacity: 0.7 }}
        >
          Search on YouTube →
        </a>
      </div>
    </div>
  );
}
