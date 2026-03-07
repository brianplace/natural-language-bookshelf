import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerAddBookToShelfTool = (server: McpServer) => {
    server.registerTool(
        'AddBookToShelf',
        {
            title: 'Add Book to Shelf',
            description: 'Add a saved book to the shelf',
            inputSchema: { shelfId: z.string(), bookId: z.string() },
        },
        async ({ shelfId, bookId }) => {
            await apiCall('post', `/shelves/${shelfId}/books`, { bookId });
            return {
                content: [{ type: 'text', text: 'Book added to shelf.' }],
            };
        },
    );
};
