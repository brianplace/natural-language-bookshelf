'use client';

import type { PanelData } from '../app/page';

interface ResultsPanelProps {
  data: PanelData;
  authenticated: boolean;
}

export default function ResultsPanel({ data, authenticated }: ResultsPanelProps) {
  if (data.type === 'idle') {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          {authenticated
            ? 'Ask about your books and shelves to see them here.'
            : 'Sign in to see your library here.'}
        </p>
      </div>
    );
  }

  if (data.type === 'books') {
    type BookResult = {
      title?: string;
      authors?: string[];
      thumbnail_url?: string;
      cover_url?: string;
      openLibraryKey?: string;
      key?: string;
    };
    const books = data.books as BookResult[];

    return (
      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-4">
          Search results
        </p>
        <div className="grid grid-cols-3 gap-5">
          {books.map((b, i) => {
            const cover = b.thumbnail_url ?? b.cover_url;
            return (
              <div key={b.openLibraryKey ?? b.key ?? i} className="flex flex-col gap-1.5">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={b.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-xs text-zinc-400">No cover</span>
                  </div>
                )}
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-snug">
                  {b.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                  {b.authors?.join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (data.type === 'shelves') {
    type ShelfResult = {
      id: number | string;
      name: string;
      _count?: { books: number };
    };
    const shelves = data.shelves as ShelfResult[];

    return (
      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-4">
          Your shelves
        </p>
        {shelves.length === 0 ? (
          <p className="text-sm text-zinc-400">No shelves yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {shelves.map(shelf => (
              <div
                key={shelf.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{shelf.name}</p>
                {shelf._count != null && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {shelf._count.books} {shelf._count.books === 1 ? 'book' : 'books'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
