'use client';

import { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import type { PanelData } from '../app/page';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface AppChatProps {
  token: string;
  onResults: (data: PanelData) => void;
}

export default function AppChat({ token, onResults }: AppChatProps) {
  const onResultsRef = useRef(onResults);
  useEffect(() => { onResultsRef.current = onResults; });

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { token },
  });

  useEffect(() => {
    type Invocation = { toolName: string; state: string; result?: unknown };
    const invocations = messages
      .filter(m => m.role === 'assistant')
      .flatMap(m => (m.toolInvocations ?? []) as Invocation[])
      .filter(t => t.state === 'result');

    const last = [...invocations].reverse().find(
      t => t.toolName === 'searchBooks' || t.toolName === 'listShelves'
    );

    if (!last) return;

    if (last.toolName === 'searchBooks') {
      onResultsRef.current({ type: 'books', books: Array.isArray(last.result) ? last.result : [] });
    } else {
      onResultsRef.current({ type: 'shelves', shelves: Array.isArray(last.result) ? last.result : [] });
    }
  }, [messages]);

  return (
    <>
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
