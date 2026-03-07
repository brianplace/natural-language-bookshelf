import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerDeleteShelfTool = (server: McpServer) => {
    server.registerTool(
        'DeleteShelf',
        {
            title: 'Delete Shelf',
            description: 'Delete a shelf and remove all its books',
            inputSchema: { shelfId: z.string() },
        },
        async ({ shelfId }) => {
            await apiCall('delete', `/shelves/${shelfId}`);
            return { content: [{ type: 'text', text: 'Shelf deleted.' }] };
        },
    );
};
