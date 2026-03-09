import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { addBookToShelfInputSchema, AddBookToShelfInput, AddBookToShelfOutput } from './addBookToShelfToolSchemas';

async function addBookToShelfHandler({ shelfId, bookId }: AddBookToShelfInput): Promise<AddBookToShelfOutput> {
    await apiCall('post', `/shelves/${shelfId}/books`, { bookId });
    return {
        content: [{ type: 'text', text: 'Book added to shelf.' }],
    };
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
