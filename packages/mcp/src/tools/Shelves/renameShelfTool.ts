import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerRenameShelfTool = (server: McpServer) => {
    server.registerTool(
        'RenameShelf',
        {
            title: 'Rename Shelf',
            description: 'Rename an existing shelf',
            inputSchema: { shelfId: z.string(), name: z.string() },
        },
        async ({ shelfId, name }) => {
            const res = await apiCall('patch', `/shelves/${shelfId}`, { name });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Shelf renamed to "${res.data.name}"`,
                    },
                ],
            };
        },
    );
};
