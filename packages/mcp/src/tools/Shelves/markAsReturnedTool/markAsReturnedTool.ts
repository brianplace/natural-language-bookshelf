import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { markAsReturnedInputSchema, MarkAsReturnedInput, MarkAsReturnedOutput } from './markAsReturnedToolSchemas';

async function markAsReturnedHandler({ shelfId, bookId }: MarkAsReturnedInput): Promise<MarkAsReturnedOutput> {
    await apiCall('patch', `/shelves/${shelfId}/books/${bookId}/return`, {});
    return {
        content: [{ type: 'text', text: 'Book marked as returned.' }],
    };
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
