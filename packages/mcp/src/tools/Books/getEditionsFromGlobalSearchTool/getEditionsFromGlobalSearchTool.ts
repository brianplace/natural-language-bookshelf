import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { getEditions } from '../../../services/bookService';
import {
    getEditionsFromGlobalSearchInputSchema,
    GetEditionsFromGlobalSearchInput,
    GetEditionsFromGlobalSearchOutput,
} from './getEditionsFromGlobalSearchToolSchemas';

async function getEditionsFromGlobalSearchHandler(input: GetEditionsFromGlobalSearchInput): Promise<GetEditionsFromGlobalSearchOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const editions = await getEditions(input.openLibraryId);
        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(editions, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error fetching editions: ${error.message}` }] };
    }
}

export const registerGetEditionsFromGlobalSearchTool = (server: McpServer) => {
    server.registerTool(
        'GetEditionsFromGlobalSearch',
        {
            title: 'Get All Editions for a Book',
            description: 'Returns all editions of a book from OpenLibrary given its OpenLibrary work ID (openLibraryId). Should only be called after SearchBooksGlobal has been used to retrieve the openLibraryId. Use this when the user wants to see all available editions of a specific book.',
            inputSchema: getEditionsFromGlobalSearchInputSchema,
        },
        getEditionsFromGlobalSearchHandler,
    );
};
