import { randomUUID } from 'crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { addToCollectionInputSchema, AddToCollectionInput, AddToCollectionOutput } from './addToCollectionToolSchemas';

async function addToCollectionHandler(input: AddToCollectionInput): Promise<AddToCollectionOutput> {
    const openLibraryId = input.openLibraryId ?? `manual_${randomUUID()}`;
    const fullTitle = input.fullTitle || input.title;
    await apiCall('post', '/books/save-collection', { ...input, openLibraryId, fullTitle });
    return {
        content: [{ type: 'text', text: 'Book added to your collection' }],
    };
}

export const registerAddToCollectionTool = (server: McpServer) => {
    server.registerTool(
        'AddToCollection',
        {
            title: 'Add a book to your collection',
            description: 'Add a book to the user\'s personal collection. The book will be saved to the database automatically if it does not already exist.',
            inputSchema: addToCollectionInputSchema,
        },
        addToCollectionHandler,
    );
};
