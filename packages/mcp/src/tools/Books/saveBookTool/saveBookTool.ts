import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { saveBookInputSchema, SaveBookInput, SaveBookOutput } from './saveBookToolSchemas';

async function saveBookHandler(bookData: SaveBookInput): Promise<SaveBookOutput> {
    const fullTitle = bookData.fullTitle || bookData.title;
    const res = await apiCall('post', '/books/save', { ...bookData, fullTitle });
    return {
        content: [{ type: 'text', text: `Book saved with ID: ${res.data.id}` }],
    };
}

export const registerSaveBookTool = (server: McpServer) => {
    server.registerTool(
        'SaveBook',
        {
            title: 'Save a book',
            description: 'Save a book to the library so that it can be added to collections and shelves; can also be used to update a book\'s profile',
            inputSchema: saveBookInputSchema,
        },
        saveBookHandler,
    );
};
