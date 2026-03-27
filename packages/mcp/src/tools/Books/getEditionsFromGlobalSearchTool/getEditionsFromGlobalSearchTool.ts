import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import {
    getEditionsFromGlobalSearchInputSchema,
    GetEditionsFromGlobalSearchInput,
    GetEditionsFromGlobalSearchOutput,
} from './getEditionsFromGlobalSearchToolSchemas';

async function getEditionsFromGlobalSearchHandler(input: GetEditionsFromGlobalSearchInput): Promise<GetEditionsFromGlobalSearchOutput> {
    const res = await apiCall('get', `/books/get-editions?openLibraryId=${encodeURIComponent(input.openLibraryId)}`, {});

    return {
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(res.data, null, 2),
            },
        ],
    };
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
