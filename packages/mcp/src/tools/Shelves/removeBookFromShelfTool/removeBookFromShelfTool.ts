import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { removeBookFromShelfInputSchema, RemoveBookFromShelfInput, RemoveBookFromShelfOutput } from './removeBookFromShelfToolSchemas';

async function removeBookFromShelfHandler({ shelfId, bookId }: RemoveBookFromShelfInput): Promise<RemoveBookFromShelfOutput> {
    await apiCall('delete', `/shelves/${shelfId}/books/${bookId}`);
    return {
        content: [{ type: 'text', text: 'Book removed from shelf.' }],
    };
}

export const registerRemoveBookFromShelfTool = (server: McpServer) => {
    server.registerTool(
        'RemoveBookFromShelf',
        {
            title: 'Remove book from shelf',
            description: 'Remove a book from a shelf',
            inputSchema: removeBookFromShelfInputSchema,
        },
        removeBookFromShelfHandler,
    );
};
