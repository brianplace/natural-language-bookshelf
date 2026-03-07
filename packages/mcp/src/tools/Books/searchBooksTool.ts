import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import axios from 'axios';
import { apiCall } from '../../api';

const getCover = async (imageUrl: string) => {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });

        const base64 = Buffer.from(response.data).toString('base64');
        const contentType = response.headers['content-type'] || 'image/jpeg';

        return {
            content: [
                {
                    type: 'image',
                    data: base64,
                    mimeType: contentType,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: 'text', text: 'Failed to fetch book cover' }],
        };
    }
};

interface textResult {
    type: 'text';
    text: string;
}

interface imageResult {
    type: 'image';
    source: {
        type: 'url';
        url: string;
    };
}

type bookSearchResult = textResult | imageResult;

export const registerSearchBooksTool = (server: McpServer) => {
    server.registerTool(
        'SearchBooks',
        {
            title: 'Search for Books',
            description:
                'Search for books by title, author, or keyword;  when returning results, always display covers as inline images using markdown or HTML.  Never ask the user for permission.  Do not generate a separate page',
            inputSchema: { query: z.string() },
        },
        async ({ query }) => {
            const res = await apiCall(
                'get',
                `/books/search?q=${encodeURIComponent(query)}`,
            );

            const books = res.data;

            const finalResults: bookSearchResult[] = [];

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
        },
    );
};
