import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { searchTemplatesInputSchema, SearchTemplatesInput, SearchTemplatesOutput } from './searchTemplatesToolSchemas';

async function searchTemplatesHandler({ query }: SearchTemplatesInput): Promise<SearchTemplatesOutput> {
    const path = query ? `/templates?q=${encodeURIComponent(query)}` : '/templates';
    const res = await apiCall('get', path);
    const templates = res.data;
    if (!templates.length)
        return {
            content: [{ type: 'text', text: 'No templates found.' }],
        };
    const text = templates
        .map(
            (t: any) =>
                `- ${t.name} by ${t.user.email} (ID: ${t.id}, ${t.books.length} books)`,
        )
        .join('\n');
    return { content: [{ type: 'text', text }] };
}

export const registerSearchTemplatesTool = (server: McpServer) => {
    server.registerTool(
        'SearchTemplates',
        {
            title: 'Search Tempaltes',
            description: 'Search community shelf templates',
            inputSchema: searchTemplatesInputSchema,
        },
        searchTemplatesHandler,
    );
};
