type ProseContentProps = {
  content: string;
  className?: string;
};

export function ProseContent({ content, className = "" }: ProseContentProps) {
  return (
    <div
      className={`prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-ness prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-ness prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-ul:text-slate-300 prose-li:text-slate-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
