import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { renameShelfInputSchema, RenameShelfInput, RenameShelfOutput } from './renameShelfToolSchemas';

async function renameShelfHandler({ shelfId, name }: RenameShelfInput): Promise<RenameShelfOutput> {
    const res = await apiCall('patch', `/shelves/${shelfId}`, { name });
    return {
        content: [{ type: 'text', text: `Shelf renamed to "${res.data.name}"` }],
    };
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
