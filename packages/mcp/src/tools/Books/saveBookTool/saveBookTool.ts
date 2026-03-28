import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { saveBook } from '../../../services/bookService';
import { saveBookInputSchema, SaveBookInput, SaveBookOutput } from './saveBookToolSchemas';

async function saveBookHandler(bookData: SaveBookInput): Promise<SaveBookOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const fullTitle = bookData.fullTitle || bookData.title;
        const book = await saveBook({ ...bookData, fullTitle });
        return {
            content: [{ type: 'text', text: `Book saved with ID: ${book.id}` }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error saving book: ${error.message}` }] };
    }
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
