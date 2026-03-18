import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import axios from 'axios';
import { apiCall } from '../../../api';
import { searchBooksGlobalInputSchema, SearchBooksGlobalInput, SearchBooksGlobalOutput, BookSearchGlobalResult } from './searchBooksGlobalToolSchemas';

async function searchBooksGlobalHandler(input: SearchBooksGlobalInput): Promise<SearchBooksGlobalOutput> {
    const res = await apiCall('get', '/books/search-global', input);

    const books = res.data;

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
    }

    return {
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(finalResults, null, 2),
            },
        ],
    };
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
