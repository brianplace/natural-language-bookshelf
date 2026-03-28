import { randomUUID } from 'crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { saveToCollection } from '../../../services/bookService';
import { addToCollectionInputSchema, AddToCollectionInput, AddToCollectionOutput } from './addToCollectionToolSchemas';

async function addToCollectionHandler(input: AddToCollectionInput): Promise<AddToCollectionOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const openLibraryId = input.openLibraryId ?? `manual_${randomUUID()}`;
        const fullTitle = input.fullTitle || input.title;
        await saveToCollection(userId, { ...input, openLibraryId, fullTitle });
        return {
            content: [{ type: 'text', text: 'Book added to your collection' }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error adding book to collection: ${error.message}` }] };
    }
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
