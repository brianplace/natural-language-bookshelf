'use client';

import { useEffect, useRef } from 'react';
import type { Message } from 'ai';
import ChatMessage from './ChatMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-2xl flex flex-col gap-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="text-sm text-zinc-400 dark:text-zinc-500">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
