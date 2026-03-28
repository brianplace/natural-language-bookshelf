import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { markAsReturned } from '../../../services/shelfService';
import { markAsReturnedInputSchema, MarkAsReturnedInput, MarkAsReturnedOutput } from './markAsReturnedToolSchemas';

async function markAsReturnedHandler({ shelfId, bookId }: MarkAsReturnedInput): Promise<MarkAsReturnedOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await markAsReturned(userId, shelfId, bookId);
        return {
            content: [{ type: 'text', text: 'Book marked as returned.' }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error marking book as returned: ${error.message}` }] };
    }
}

export const registerMarkAsReturnedTool = (server: McpServer) => {
    server.registerTool(
        'MarkAsReturned',
        {
            title: 'Mark as returned',
            description: 'Mark a lent book as returned',
            inputSchema: markAsReturnedInputSchema,
        },
        markAsReturnedHandler,
    );
};
