import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerSaveBookTool = (server: McpServer) => {
    server.registerTool(
        'SaveBook',
        {
            title: 'Save a book',
            description:
                'Save a book to the library so that it can be added to shelves',
            inputSchema: {
                openLibraryId: z.string(),
                title: z.string(),
                authors: z.array(z.string()),
                publishedDate: z.string().optional(),
                isbn: z.string().optional(),
                thumbnail: z.string().optional(),
            },
        },
        async (bookData) => {
            const res = await apiCall('post', '/books/save', bookData);

            return {
                content: [
                    {
                        type: 'text',
                        text: `Book saved with ID: ${res.data.id}`,
                    },
                ],
            };
        },
    );
};
