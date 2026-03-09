import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { listShelvesInputSchema, ListShelvesOutput } from './listShelvesToolSchemas';

async function listShelvesHandler(): Promise<ListShelvesOutput> {
    const res = await apiCall('get', '/shelves');
    const shelves = res.data;
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
