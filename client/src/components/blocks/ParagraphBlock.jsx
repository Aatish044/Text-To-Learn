export default function ParagraphBlock({ text }) {
  return (
    <p
      className="font-body text-base leading-[1.85] mb-4"
      style={{ color: "var(--text-secondary)" }}
    >
      {text}
    </p>
  );
}