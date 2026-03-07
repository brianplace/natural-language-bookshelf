import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerMarkAsLentTool = (server: McpServer) => {
    server.registerTool(
        'MarkAsLent',
        {
            title: 'Mark as Lent',
            description: 'Mark a book on a shelf as lent out to someone',
            inputSchema: {
                shelfId: z.string(),
                bookId: z.string(),
                lentTo: z.string(),
            },
        },
        async ({ shelfId, bookId, lentTo }) => {
            await apiCall('patch', `/shelves/${shelfId}/books/${bookId}/lend`, {
                lentTo,
            });
            return {
                content: [
                    { type: 'text', text: `Book marked as lent to ${lentTo}.` },
                ],
            };
        },
    );
};
