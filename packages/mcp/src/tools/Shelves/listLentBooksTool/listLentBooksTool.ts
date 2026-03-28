import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { listLentBooks } from '../../../services/lendingService';
import { listLentBooksInputSchema, ListLentBooksOutput } from './listLentBooksToolSchemas';

async function listLentBooksHandler(): Promise<ListLentBooksOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const books = await listLentBooks(userId);
        if (!books.length)
            return {
                content: [{ type: 'text', text: 'No books are currently lent out.' }],
            };
        const text = books
            .map(
                (b: any) =>
                    `- ${b.book.title} → lent to ${b.lentTo} (shelf: ${b.shelf.name})`,
            )
            .join('\n');
        return { content: [{ type: 'text', text }] };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error listing lent books: ${error.message}` }] };
    }
}

export const registerListLentBooksTool = (server: McpServer) => {
    server.registerTool(
        'ListLentBooks',
        {
            title: 'List lent books',
            description: 'List all books you currently have lent out',
            inputSchema: listLentBooksInputSchema,
        },
        listLentBooksHandler,
    );
};
