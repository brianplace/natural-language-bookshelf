import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { renameShelf } from '../../../services/shelfService';
import { renameShelfInputSchema, RenameShelfInput, RenameShelfOutput } from './renameShelfToolSchemas';

async function renameShelfHandler({ shelfId, name }: RenameShelfInput): Promise<RenameShelfOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const shelf = await renameShelf(userId, shelfId, name);
        return {
            content: [{ type: 'text', text: `Shelf renamed to "${shelf.name}"` }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error renaming shelf: ${error.message}` }] };
    }
}

export const registerRenameShelfTool = (server: McpServer) => {
    server.registerTool(
        'RenameShelf',
        {
            title: 'Rename Shelf',
            description: 'Rename an existing shelf',
            inputSchema: renameShelfInputSchema,
        },
        renameShelfHandler,
    );
};
