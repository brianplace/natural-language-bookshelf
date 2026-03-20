import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { addToCollectionInputSchema, AddToCollectionInput, AddToCollectionOutput } from './addToCollectionToolSchemas';

async function addToCollectionHandler(input: AddToCollectionInput): Promise<AddToCollectionOutput> {
    await apiCall('post', '/books/save-collection', input);
    return {
        content: [{ type: 'text', text: 'Book added to your collection' }],
    };
}

export const registerAddToCollectionTool = (server: McpServer) => {
    server.registerTool(
        'AddToCollection',
        {
            title: 'Add a book to your collection',
            description: 'Add a book to the user\'s personal collection. The book must already be saved to the database. Call SaveBook or SaveBookFromGlobal first if needed.',
            inputSchema: addToCollectionInputSchema,
        },
        addToCollectionHandler,
    );
};
