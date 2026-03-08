import { streamText, tool } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';

const SYSTEM_PROMPT = `You are a helpful bookshelf assistant. You help users manage their personal book collection using natural language.

## Adding books (3-step flow)
To add a book to a shelf, you must:
1. Call searchBooks to find the book — results include an openLibraryKey
2. Call saveBook with the openLibraryKey to save it to the database — this returns a numeric book id
3. Call addBookToShelf with the shelf id and the book id from step 2

Always follow all 3 steps in order. Do not skip saveBook.

## Book search results
When returning book search results, embed cover images inline using markdown:
![Cover](thumbnail_url)
Use the thumbnail_url field from each result.

## General behavior
- Confirm actions clearly after completing them
- Infer intent from conversation context (e.g. "add the first one" refers to the first search result)
- For ambiguous requests, ask a clarifying question
- Keep responses concise and friendly`;

export async function POST(req: Request) {
  const { messages, token } = await req.json();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

  async function api(method: string, path: string, body?: unknown) {
    const res = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'API error');
    return json.data;
  }

  const result = streamText({
    model: ollama('llama3.2'),
    system: SYSTEM_PROMPT,
    messages,
    maxSteps: 10,
    tools: {
      searchBooks: tool({
        description: 'Search for books by title, author, or keyword',
        parameters: z.object({ q: z.string().describe('Search query') }),
        execute: async ({ q }) => api('GET', `/books/search?q=${encodeURIComponent(q)}`),
      }),
      saveBook: tool({
        description: 'Save a book to the database using its Open Library key. Returns the saved book with its database id.',
        parameters: z.object({ openLibraryKey: z.string().describe('The Open Library key from search results') }),
        execute: async ({ openLibraryKey }) => api('POST', '/books/save', { openLibraryKey }),
      }),
      listShelves: tool({
        description: 'List all shelves for the current user',
        parameters: z.object({}),
        execute: async () => api('GET', '/shelves'),
      }),
      createShelf: tool({
        description: 'Create a new shelf',
        parameters: z.object({ name: z.string().describe('Name of the new shelf') }),
        execute: async ({ name }) => api('POST', '/shelves', { name }),
      }),
      renameShelf: tool({
        description: 'Rename an existing shelf',
        parameters: z.object({
          id: z.number().describe('Shelf id'),
          name: z.string().describe('New name for the shelf'),
        }),
        execute: async ({ id, name }) => api('PATCH', `/shelves/${id}`, { name }),
      }),
      deleteShelf: tool({
        description: 'Delete a shelf',
        parameters: z.object({ id: z.number().describe('Shelf id') }),
        execute: async ({ id }) => api('DELETE', `/shelves/${id}`),
      }),
      addBookToShelf: tool({
        description: 'Add a saved book to a shelf. The book must first be saved via saveBook.',
        parameters: z.object({
          shelfId: z.number().describe('Shelf id'),
          bookId: z.number().describe('Book database id (from saveBook result)'),
        }),
        execute: async ({ shelfId, bookId }) => api('POST', `/shelves/${shelfId}/books`, { bookId }),
      }),
      removeBookFromShelf: tool({
        description: 'Remove a book from a shelf',
        parameters: z.object({
          shelfId: z.number().describe('Shelf id'),
          bookId: z.number().describe('Book id'),
        }),
        execute: async ({ shelfId, bookId }) => api('DELETE', `/shelves/${shelfId}/books/${bookId}`),
      }),
      moveBook: tool({
        description: 'Move a book from one shelf to another',
        parameters: z.object({
          fromShelfId: z.number().describe('Source shelf id'),
          bookId: z.number().describe('Book id'),
          toShelfId: z.number().describe('Destination shelf id'),
        }),
        execute: async ({ fromShelfId, bookId, toShelfId }) =>
          api('POST', `/shelves/${fromShelfId}/books/${bookId}/move`, { toShelfId }),
      }),
      markAsLent: tool({
        description: 'Mark a book as lent to someone',
        parameters: z.object({
          shelfId: z.number().describe('Shelf id'),
          bookId: z.number().describe('Book id'),
          lentTo: z.string().describe('Name of person the book is lent to'),
        }),
        execute: async ({ shelfId, bookId, lentTo }) =>
          api('PATCH', `/shelves/${shelfId}/books/${bookId}/lend`, { lentTo }),
      }),
      markAsReturned: tool({
        description: 'Mark a lent book as returned',
        parameters: z.object({
          shelfId: z.number().describe('Shelf id'),
          bookId: z.number().describe('Book id'),
        }),
        execute: async ({ shelfId, bookId }) =>
          api('PATCH', `/shelves/${shelfId}/books/${bookId}/return`),
      }),
      listLentBooks: tool({
        description: 'List all books currently lent out',
        parameters: z.object({}),
        execute: async () => api('GET', '/lending'),
      }),
      searchTemplates: tool({
        description: 'Search public shelf templates',
        parameters: z.object({ q: z.string().describe('Search query') }),
        execute: async ({ q }) => api('GET', `/templates?q=${encodeURIComponent(q)}`),
      }),
      cloneTemplate: tool({
        description: 'Clone a public shelf template to your account',
        parameters: z.object({ id: z.number().describe('Template id') }),
        execute: async ({ id }) => api('POST', `/templates/${id}/clone`),
      }),
      publishTemplate: tool({
        description: 'Publish one of your shelves as a public template',
        parameters: z.object({ id: z.number().describe('Shelf id') }),
        execute: async ({ id }) => api('POST', `/templates/${id}/publish`),
      }),
      unpublishTemplate: tool({
        description: 'Unpublish a shelf template',
        parameters: z.object({ id: z.number().describe('Template id') }),
        execute: async ({ id }) => api('POST', `/templates/${id}/unpublish`),
      }),
    },
  });

  return result.toDataStreamResponse();
}
