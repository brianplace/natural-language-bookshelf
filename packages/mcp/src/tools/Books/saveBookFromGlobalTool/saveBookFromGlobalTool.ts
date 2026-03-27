import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { saveBookFromGlobalInputSchema, SaveBookFromGlobalInput, SaveBookFromGlobalOutput } from './saveBookFromGlobalToolSchemas';

async function saveBookFromGlobalHandler(input: SaveBookFromGlobalInput): Promise<SaveBookFromGlobalOutput> {
    const { additionalAuthors, ...rest } = input;
    const authors = [...rest.authors, ...(additionalAuthors ?? [])];

    const fullTitle = rest.fullTitle || rest.title;
    const res = await apiCall('post', '/books/save', { ...rest, authors, fullTitle });
    return {
        content: [{ type: 'text', text: `Book saved with ID: ${res.data.id}` }],
    };
}

export const registerSaveBookFromGlobalTool = (server: McpServer) => {
    server.registerTool(
        'SaveBookFromGlobal',
        {
            title: 'Save a book from a global search result',
            description: 'Save a book to the library using data from a global search result. Use this instead of SaveBook when the user wants to review or correct the title and authors before saving.',
            inputSchema: saveBookFromGlobalInputSchema,
        },
        saveBookFromGlobalHandler,
    );
};
