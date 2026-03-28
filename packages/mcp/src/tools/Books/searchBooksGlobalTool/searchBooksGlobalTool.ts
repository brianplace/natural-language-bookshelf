import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { searchBooksGlobal } from '../../../services/bookService';
import { searchBooksGlobalInputSchema, SearchBooksGlobalInput, SearchBooksGlobalOutput, BookSearchGlobalResult } from './searchBooksGlobalToolSchemas';

async function searchBooksGlobalHandler(input: SearchBooksGlobalInput): Promise<SearchBooksGlobalOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const books = await searchBooksGlobal({
            title: input.title,
            author: input.author,
            isbn10: input.isbn10,
            isbn13: input.isbn13,
        }) as any[];

        const finalResults: BookSearchGlobalResult[] = [];

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

            if (book.hasMoreEditions) {
                finalResults.push({
                    type: 'text',
                    text: `Note: "${book.title}" has more than 10 editions. Only the first 10 are included above.`,
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
        return { content: [{ type: 'text', text: `Error searching books globally: ${error.message}` }] };
    }
}

export const registerSearchBooksGlobalTool = (server: McpServer) => {
    server.registerTool(
        'SearchBooksGlobal',
        {
            title: 'Search for Books Globally',
            description:
                `Search globally for books by title, author, or keyword.
                Should only be used after using SearchBooks tool unless specifically requested by the user.
                Never ask the user for permission.
                Do not generate a separate page.`,
            inputSchema: searchBooksGlobalInputSchema,
        },
        searchBooksGlobalHandler,
    );
};
