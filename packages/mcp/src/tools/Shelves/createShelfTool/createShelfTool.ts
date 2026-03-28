import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { createShelf } from '../../../services/shelfService';
import { createShelfInputSchema, CreateShelfInput, CreateShelfOutput } from './createShelfToolSchemas';

async function createShelfHandler({ name }: CreateShelfInput): Promise<CreateShelfOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const shelf = await createShelf(userId, name);
        return {
            content: [{ type: 'text', text: `Shelf "${shelf.name}" created with ID: ${shelf.id}` }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error creating shelf: ${error.message}` }] };
    }
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
