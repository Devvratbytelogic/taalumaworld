import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownContentProps {
  content?: string | null;
  emptyMessage?: string;
  className?: string;
}

export default function MarkdownContent({
  content,
  emptyMessage = 'No content available.',
  className = '',
}: MarkdownContentProps) {
  if (!content) {
    return (
      <p className="leading-relaxed text-muted-foreground text-center py-12">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={`prose prose-sm sm:prose-base max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
