import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders the markdown article body (pull quotes as blockquotes, GFM tables,
 * responsive imagery via prose styles). Raw HTML in markdown is NOT rendered
 * — react-markdown escapes it by default, which is our sanitization layer.
 */
export function ArticleBody({ body }: { body: string }) {
  return (
    <div className="gp-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
