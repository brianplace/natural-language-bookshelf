import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { removeBookFromShelf } from '../../../services/shelfService';
import { removeBookFromShelfInputSchema, RemoveBookFromShelfInput, RemoveBookFromShelfOutput } from './removeBookFromShelfToolSchemas';

async function removeBookFromShelfHandler({ shelfId, bookId }: RemoveBookFromShelfInput): Promise<RemoveBookFromShelfOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await removeBookFromShelf(userId, shelfId, bookId);
        return {
            content: [{ type: 'text', text: 'Book removed from shelf.' }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error removing book from shelf: ${error.message}` }] };
    }
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
