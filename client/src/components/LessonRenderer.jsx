import HeadingBlock   from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock      from "./blocks/CodeBlock";
import VideoBlock     from "./blocks/VideoBlock";
import MCQBlock       from "./blocks/MCQBlock";

export default function LessonRenderer({ content }) {
  if (!content || content.length === 0) return null;

  return (
    <div className="space-y-6">
      {content.map((block, i) => {
        switch (block.type) {
          case "heading":   return <HeadingBlock   key={i} {...block} />;
          case "paragraph": return <ParagraphBlock key={i} {...block} />;
          case "code":      return <CodeBlock      key={i} {...block} />;
          case "video":     return <VideoBlock     key={i} {...block} />;
          case "mcq":       return <MCQBlock       key={i} {...block} index={i} />;
          default:          return null;
        }
      })}
    </div>
  );
}
