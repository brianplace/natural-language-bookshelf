import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { moveBookInputSchema, MoveBookInput, MoveBookOutput } from './moveBookToolSchemas';

async function moveBookHandler({ fromShelfId, toShelfId, bookId }: MoveBookInput): Promise<MoveBookOutput> {
    await apiCall('post', `/shelves/${fromShelfId}/books/${bookId}/move`, { toShelfId });
    return {
        content: [{ type: 'text', text: 'Book moved successfully.' }],
    };
}

export const registerMoveBookTool = (server: McpServer) => {
    server.registerTool(
        'MoveBook',
        {
            title: 'Move Book',
            description: 'Move a book from one shelf to another',
            inputSchema: moveBookInputSchema,
        },
        moveBookHandler,
    );
};
