import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import axios from 'axios';
import { apiCall } from '../../../api';
import { searchBooksInputSchema, SearchBooksInput, SearchBooksOutput, BookSearchResult } from './searchBooksToolSchemas';

async function searchBooksHandler(input: SearchBooksInput): Promise<SearchBooksOutput> {
    const apiInput = {
        title: input.title,
        author: input.author,
        isbn: input.isbn10 ? input.isbn10 : input.isbn13
    };

    const res = await apiCall('get', '/books/search', apiInput);

    const books = res.data;

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
