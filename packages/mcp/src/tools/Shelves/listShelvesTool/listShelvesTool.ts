import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { listShelves } from '../../../services/shelfService';
import { listShelvesInputSchema, ListShelvesOutput } from './listShelvesToolSchemas';

async function listShelvesHandler(): Promise<ListShelvesOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const shelves = await listShelves(userId);
        if (!shelves.length)
            return {
                content: [{ type: 'text', text: 'You have no shelves yet.' }],
            };
        const text = shelves
            .map((s: any) => {
                const books = s.books
                    .map((b: any) => `  - ${b.book.title}`)
                    .join('\n');
                return `${s.name} (ID: ${s.id}):\n${books || '  (empty)'}`;
            })
            .join('\n\n');
        return { content: [{ type: 'text', text }] };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error listing shelves: ${error.message}` }] };
    }
}

export const registerListShelvesTool = (server: McpServer) => {
    server.registerTool(
        'ListShelves',
        {
            title: 'List Shelves',
            description: 'List all your shelves and their books',
            inputSchema: listShelvesInputSchema,
        },
        listShelvesHandler,
    );
};
