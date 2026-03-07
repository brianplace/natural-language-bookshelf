import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerMoveBookTool = (server: McpServer) => {
    server.registerTool(
        'MoveBook',
        {
            title: 'Move Book',
            description: 'Move a book from one shelf to another',
            inputSchema: {
                fromShelfId: z.string(),
                toShelfId: z.string(),
                bookId: z.string(),
            },
        },
        async ({ fromShelfId, toShelfId, bookId }) => {
            await apiCall(
                'post',
                `/shelves/${fromShelfId}/books/${bookId}/move`,
                {
                    toShelfId,
                },
            );
            return {
                content: [{ type: 'text', text: 'Book moved successfully.' }],
            };
        },
    );
};
