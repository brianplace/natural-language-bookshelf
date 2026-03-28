import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { markAsLent } from '../../../services/shelfService';
import { markAsLentInputSchema, MarkAsLentInput, MarkAsLentOutput } from './markAsLentToolSchemas';

async function markAsLentHandler({ shelfId, bookId, lentTo }: MarkAsLentInput): Promise<MarkAsLentOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await markAsLent(userId, shelfId, bookId, lentTo);
        return {
            content: [{ type: 'text', text: `Book marked as lent to ${lentTo}.` }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error marking book as lent: ${error.message}` }] };
    }
}

export const registerMarkAsLentTool = (server: McpServer) => {
    server.registerTool(
        'MarkAsLent',
        {
            title: 'Mark as Lent',
            description: 'Mark a book on a shelf as lent out to someone',
            inputSchema: markAsLentInputSchema,
        },
        markAsLentHandler,
    );
};
