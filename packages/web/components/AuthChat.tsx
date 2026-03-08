'use client';

import { useState, useEffect, useRef } from 'react';

type AuthStep = 'welcome' | 'email' | 'password' | 'loading';
type AuthMode = 'login' | 'register';

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AuthChatProps {
  onSuccess: (token: string) => void;
}

const WELCOME: LocalMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Welcome to Bookshelf. Would you like to sign in or create a new account?",
};

function detectMode(text: string): AuthMode | null {
  const t = text.toLowerCase();
  if (/sign[\s-]?in|log[\s-]?in|signin|login/.test(t)) return 'login';
  if (/register|sign[\s-]?up|create|new account/.test(t)) return 'register';
  return null;
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function AuthChat({ onSuccess }: AuthChatProps) {
  const [messages, setMessages] = useState<LocalMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<AuthStep>('welcome');
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  function addMessage(role: 'user' | 'assistant', content: string) {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, content }]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value || step === 'loading') return;
    setInput('');

    if (step === 'welcome') {
      const detected = detectMode(value);
      addMessage('user', value);
      if (!detected) {
        addMessage('assistant', "I didn't catch that — would you like to sign in or create a new account?");
        return;
      }
      setMode(detected);
      setStep('email');
      addMessage('assistant', "What's your email address?");
      return;
    }

    if (step === 'email') {
      addMessage('user', value);
      if (!isValidEmail(value)) {
        addMessage('assistant', "That doesn't look like a valid email. Could you try again?");
        return;
      }
      setEmail(value);
      setStep('password');
      addMessage('assistant', "And your password?");
      return;
    }

    if (step === 'password') {
      addMessage('user', '••••••••');
      setStep('loading');
      addMessage('assistant', 'One moment…');
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: value, mode }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStep('password');
          setMessages(prev => prev.slice(0, -1));
          addMessage('assistant', `${data.error ?? 'Something went wrong.'} Please try again.`);
        } else {
          addMessage('assistant',
            mode === 'login'
              ? "You're signed in. What can I help you with?"
              : "Account created! What can I help you with?"
          );
          onSuccess(data.token);
        }
      } catch {
        setStep('password');
        setMessages(prev => prev.slice(0, -1));
        addMessage('assistant', "Network error. Please try again.");
      }
      return;
    }
  }

  const placeholder =
    step === 'welcome' ? 'Sign in or create account…' :
    step === 'email' ? 'your@email.com' :
    step === 'password' ? 'Password' : '…';

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={
              m.role === 'user'
                ? 'max-w-[80%] rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                : 'max-w-[85%] text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed'
            }>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-4 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type={step === 'password' ? 'password' : 'text'}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={step === 'loading'}
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || step === 'loading'}
            className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
