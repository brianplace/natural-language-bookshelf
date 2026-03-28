import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { deleteShelf } from '../../../services/shelfService';
import { deleteShelfInputSchema, DeleteShelfInput, DeleteShelfOutput } from './deleteShelfToolSchemas';

async function deleteShelfHandler({ shelfId }: DeleteShelfInput): Promise<DeleteShelfOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await deleteShelf(userId, shelfId);
        return { content: [{ type: 'text', text: 'Shelf deleted.' }] };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error deleting shelf: ${error.message}` }] };
    }
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
