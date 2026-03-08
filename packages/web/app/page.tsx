'use client';

import { useState, useEffect } from 'react';
import { getToken, setToken, clearToken } from '../lib/auth';
import AuthChat from '../components/AuthChat';
import AppChat from '../components/AppChat';
import ResultsPanel from '../components/ResultsPanel';

export type PanelData =
  | { type: 'idle' }
  | { type: 'books'; books: unknown[] }
  | { type: 'shelves'; shelves: unknown[] };

export default function Home() {
  const [token, setTokenState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelData, setPanelData] = useState<PanelData>({ type: 'idle' });

  useEffect(() => {
    setTokenState(getToken());
    setMounted(true);
  }, []);

  function handleAuth(t: string) {
    setToken(t);
    setTokenState(t);
  }

  function handleSignOut() {
    clearToken();
    setTokenState(null);
    setPanelData({ type: 'idle' });
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 shrink-0">
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Bookshelf</h1>
        {token && (
          <button
            onClick={handleSignOut}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Sign out
          </button>
        )}
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[420px] shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800">
          {token ? (
            <AppChat token={token} onResults={setPanelData} />
          ) : (
            <AuthChat onSuccess={handleAuth} />
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <ResultsPanel data={panelData} authenticated={!!token} />
        </div>
      </div>
    </div>
  );
}
