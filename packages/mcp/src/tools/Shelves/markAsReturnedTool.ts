import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerMarkAsReturnedTool = (server: McpServer) => {
    server.registerTool(
        'MarkAsReturned',
        {
            title: 'Mark as returned',
            description: 'Mark a lent book as returned',
            inputSchema: { shelfId: z.string(), bookId: z.string() },
        },
        async ({ shelfId, bookId }) => {
            await apiCall(
                'patch',
                `/shelves/${shelfId}/books/${bookId}/return`,
                {},
            );
            return {
                content: [{ type: 'text', text: 'Book marked as returned.' }],
            };
        },
    );
};
