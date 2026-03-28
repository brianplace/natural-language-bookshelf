import { randomUUID } from 'crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { saveBook } from '../../../services/bookService';
import { saveBookManuallyInputSchema, SaveBookManuallyInput, SaveBookManuallyOutput } from './saveBookManuallyToolSchemas';

async function saveBookManuallyHandler(input: SaveBookManuallyInput): Promise<SaveBookManuallyOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const openLibraryId = input.openLibraryId ?? `manual_${randomUUID()}`;
        const fullTitle = input.fullTitle || input.title;
        const book = await saveBook({ ...input, openLibraryId, fullTitle });
        return {
            content: [{ type: 'text', text: `Book saved with ID: ${book.id}` }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error saving book: ${error.message}` }] };
    }
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
