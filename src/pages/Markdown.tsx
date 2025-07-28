import ReactMarkdown from "react-markdown";
function MarkdownPage({ markdownContent }: { markdownContent: string }) {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto p-4">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </article>
  );
}
export default MarkdownPage;
