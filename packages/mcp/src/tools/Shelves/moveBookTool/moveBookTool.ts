import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { moveBook } from '../../../services/shelfService';
import { moveBookInputSchema, MoveBookInput, MoveBookOutput } from './moveBookToolSchemas';

async function moveBookHandler({ fromShelfId, toShelfId, bookId }: MoveBookInput): Promise<MoveBookOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await moveBook(userId, fromShelfId, bookId, toShelfId);
        return {
            content: [{ type: 'text', text: 'Book moved successfully.' }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error moving book: ${error.message}` }] };
    }
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
