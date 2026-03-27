import { randomUUID } from 'crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { saveBookManuallyInputSchema, SaveBookManuallyInput, SaveBookManuallyOutput } from './saveBookManuallyToolSchemas';

async function saveBookManuallyHandler(input: SaveBookManuallyInput): Promise<SaveBookManuallyOutput> {
    const openLibraryId = input.openLibraryId ?? `manual_${randomUUID()}`;
    const fullTitle = input.fullTitle || input.title;
    const res = await apiCall('post', '/books/save', { ...input, openLibraryId, fullTitle });
    return {
        content: [{ type: 'text', text: `Book saved with ID: ${res.data.id}` }],
    };
}

export const registerSaveBookManuallyTool = (server: McpServer) => {
    server.registerTool(
        'SaveBookManually',
        {
            title: 'Save a book manually',
            description: 'Manually save a book using known details when no search results are available. Use this as a last resort after both local and global searches have returned nothing.',
            inputSchema: saveBookManuallyInputSchema,
        },
        saveBookManuallyHandler,
    );
};
