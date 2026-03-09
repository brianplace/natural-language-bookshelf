import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { createShelfInputSchema, CreateShelfInput, CreateShelfOutput } from './createShelfToolSchemas';

async function createShelfHandler({ name }: CreateShelfInput): Promise<CreateShelfOutput> {
    const res = await apiCall('post', '/shelves', { name });
    return {
        content: [{ type: 'text', text: `Shelf "${res.data.name}" created with ID: ${res.data.id}` }],
    };
}

export const registerCreateShelfTool = (server: McpServer) => {
    server.registerTool(
        'CreateShelf',
        {
            title: 'Create a shelf',
            description: 'Create a new shelf',
            inputSchema: createShelfInputSchema,
        },
        createShelfHandler,
    );
};
