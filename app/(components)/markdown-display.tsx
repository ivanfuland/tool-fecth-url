'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownDisplayProps {
  markdownContent: string;
}

export default function MarkdownDisplay({ markdownContent }: MarkdownDisplayProps) {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 bg-gray-100 rounded-md shadow">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
    </div>
  );
} 