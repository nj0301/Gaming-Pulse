import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders markdown copy (static/legal pages). Raw HTML is escaped by react-markdown by default. */
export function MarkdownBody({ body }: { body: string }) {
  return (
    <div className="gp-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
