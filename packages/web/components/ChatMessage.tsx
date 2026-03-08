'use client';

import type { Message } from 'ai';

const IMAGE_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;

function renderContent(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  IMAGE_RE.lastIndex = 0;
  while ((match = IMAGE_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={key++}>{text.slice(last, match.index)}</span>);
    }
    parts.push(
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={key++}
        src={match[2]}
        alt={match[1]}
        className="w-14 h-20 object-cover rounded shadow-sm inline-block mx-0.5 align-middle"
      />
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(<span key={key++}>{text.slice(last)}</span>);
  }
  return parts;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const text = typeof message.content === 'string' ? message.content : '';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
        {renderContent(text)}
      </div>
    </div>
  );
}
