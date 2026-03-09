import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { markAsLentInputSchema, MarkAsLentInput, MarkAsLentOutput } from './markAsLentToolSchemas';

async function markAsLentHandler({ shelfId, bookId, lentTo }: MarkAsLentInput): Promise<MarkAsLentOutput> {
    await apiCall('patch', `/shelves/${shelfId}/books/${bookId}/lend`, { lentTo });
    return {
        content: [{ type: 'text', text: `Book marked as lent to ${lentTo}.` }],
    };
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
