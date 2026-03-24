import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { getCollectionInputSchema, GetCollectionInput, GetCollectionOutput } from './getCollectionToolSchemas';

async function getCollectionHandler(_input: GetCollectionInput): Promise<GetCollectionOutput> {
    const res = await apiCall('get', '/books/collection', {});

    return {
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(res.data, null, 2),
            },
        ],
    };
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
