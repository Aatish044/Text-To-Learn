export default function HeadingBlock({ text }) {
  return (
    <h2
      className="font-display text-2xl font-bold mt-10 mb-2 pb-2 border-b"
      style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
    >
      {text}
    </h2>
  );
}