import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../api';

export const registerListLentBooksTool = (server: McpServer) => {
    server.registerTool(
        'ListLentBooks',
        {
            title: 'List lent books',
            description: 'List all books you currently have lent out',
            inputSchema: {},
        },
        async () => {
            const res = await apiCall('get', '/lending');
            const books = res.data;
            if (!books.length)
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No books are currently lent out.',
                        },
                    ],
                };
            const text = books
                .map(
                    (b: any) =>
                        `- ${b.book.title} → lent to ${b.lentTo} (shelf: ${b.shelf.name})`,
                )
                .join('\n');
            return { content: [{ type: 'text', text }] };
        },
    );
};
