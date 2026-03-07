import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall } from '../../api';

export const registerCreateShelfTool = (server: McpServer) => {
    server.registerTool(
        'CreateShelf',
        {
            title: 'Create a shelf',
            description: 'Create a new shelf',
            inputSchema: { name: z.string() },
        },
        async ({ name }) => {
            const res = await apiCall('post', '/shelves', { name });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Shelf "${res.data.name}" created with ID: ${res.data.id}`,
                    },
                ],
            };
        },
    );
};
