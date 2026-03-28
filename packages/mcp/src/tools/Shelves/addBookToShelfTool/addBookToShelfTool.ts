import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { addBookToShelf } from '../../../services/shelfService';
import { addBookToShelfInputSchema, AddBookToShelfInput, AddBookToShelfOutput } from './addBookToShelfToolSchemas';

async function addBookToShelfHandler({ shelfId, bookId }: AddBookToShelfInput): Promise<AddBookToShelfOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await addBookToShelf(userId, shelfId, bookId);
        return {
            content: [{ type: 'text', text: 'Book added to shelf.' }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error adding book to shelf: ${error.message}` }] };
    }
}

export const registerAddBookToShelfTool = (server: McpServer) => {
    server.registerTool(
        'AddBookToShelf',
        {
            title: 'Add Book to Shelf',
            description: 'Add a saved book to the shelf',
            inputSchema: addBookToShelfInputSchema,
        },
        addBookToShelfHandler,
    );
};
