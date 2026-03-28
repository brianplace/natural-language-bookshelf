import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { getCollection } from '../../../services/bookService';
import { getCollectionInputSchema, GetCollectionInput, GetCollectionOutput } from './getCollectionToolSchemas';

async function getCollectionHandler(_input: GetCollectionInput): Promise<GetCollectionOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const userBooks = await getCollection(userId);
        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(userBooks, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error fetching collection: ${error.message}` }] };
    }
}

export const registerGetCollectionTool = (server: McpServer) => {
    server.registerTool(
        'GetCollection',
        {
            title: 'Get your book collection',
            description: 'Returns all books in the current user\'s personal collection.',
            inputSchema: getCollectionInputSchema,
        },
        getCollectionHandler,
    );
};
