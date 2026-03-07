import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerRemoveBookFromShelfTool = (server: McpServer) => {
    server.registerTool(
        'RemoveBookFromShelf',
        {
            title: 'Remove book from shelf',
            description: 'Remove a book from a shelf',
            inputSchema: { shelfId: z.string(), bookId: z.string() },
        },
        async ({ shelfId, bookId }) => {
            await apiCall('delete', `/shelves/${shelfId}/books/${bookId}`);
            return {
                content: [{ type: 'text', text: 'Book removed from shelf.' }],
            };
        },
    );
};
