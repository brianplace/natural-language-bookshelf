import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { searchBooks } from '../../../services/bookService';
import { searchBooksInputSchema, SearchBooksInput, SearchBooksOutput, BookSearchResult } from './searchBooksToolSchemas';

async function searchBooksHandler(input: SearchBooksInput): Promise<SearchBooksOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const books = await searchBooks({
            title: input.title,
            author: input.author,
            isbn10: input.isbn10,
            isbn13: input.isbn13,
        }) as any[];

        const finalResults: BookSearchResult[] = [];

        finalResults.push({
            type: 'text',
            text: 'Results',
        });

        for (const book of books ?? []) {
            finalResults.push({
                type: 'text',
                text: JSON.stringify(book, null, 2),
            });

            if (book.thumbnail) {
                finalResults.push({
                    type: 'image',
                    source: {
                        type: 'url',
                        url: book.thumbnail,
                    },
                });
            }
        }

        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(finalResults, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error searching books: ${error.message}` }] };
    }
}

export const registerSearchBooksTool = (server: McpServer) => {
    server.registerTool(
        'SearchBooks',
        {
            title: 'Search for Books',
            description:
                `Search the database for books by title, author, or keyword.
                Never ask the user for permission.
                Do not generate a separate page.
                If nothing is returned, can use the SearchBooksGlobal tool to check outside of the database`,
            inputSchema: searchBooksInputSchema,
        },
        searchBooksHandler,
    );
};
