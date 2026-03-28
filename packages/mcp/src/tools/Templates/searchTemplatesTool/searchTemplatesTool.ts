import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { searchTemplates } from '../../../services/templateService';
import { searchTemplatesInputSchema, SearchTemplatesInput, SearchTemplatesOutput } from './searchTemplatesToolSchemas';

async function searchTemplatesHandler({ query }: SearchTemplatesInput): Promise<SearchTemplatesOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const templates = await searchTemplates(query);
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
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error searching templates: ${error.message}` }] };
    }
}

export const registerSearchTemplatesTool = (server: McpServer) => {
    server.registerTool(
        'SearchTemplates',
        {
            title: 'Search Templates',
            description: 'Search community shelf templates',
            inputSchema: searchTemplatesInputSchema,
        },
        searchTemplatesHandler,
    );
};
