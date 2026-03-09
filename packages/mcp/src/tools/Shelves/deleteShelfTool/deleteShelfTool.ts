import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { deleteShelfInputSchema, DeleteShelfInput, DeleteShelfOutput } from './deleteShelfToolSchemas';

async function deleteShelfHandler({ shelfId }: DeleteShelfInput): Promise<DeleteShelfOutput> {
    await apiCall('delete', `/shelves/${shelfId}`);
    return { content: [{ type: 'text', text: 'Shelf deleted.' }] };
}

export const registerDeleteShelfTool = (server: McpServer) => {
    server.registerTool(
        'DeleteShelf',
        {
            title: 'Delete Shelf',
            description: 'Delete a shelf and remove all its books',
            inputSchema: deleteShelfInputSchema,
        },
        deleteShelfHandler,
    );
};
