import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { getBook } from '../../../services/bookService';
import { getBookProfileInputSchema, GetBookProfileInput, GetBookProfileOutput } from './getBookProfileToolSchemas';

async function getBookProfileHandler(input: GetBookProfileInput): Promise<GetBookProfileOutput> {
    try {
        getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const book = await getBook(input.id);
        return {
            content: [
                {
                    type: 'text' as const,
                    text: JSON.stringify(book, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error fetching book profile: ${error.message}` }] };
    }
}

export const registerGetBookProfileTool = (server: McpServer) => {
    server.registerTool(
        'GetBookProfile',
        {
            title: 'Get Book Profile',
            description: 'Returns the full profile of a specific book from the local database by its ID. The response includes two ID fields — "id" (local database ID) and "googleBooksId" (Google Books identifier) — which are included for internal use and should not be shown to the end user unless they explicitly request them.',
            inputSchema: getBookProfileInputSchema,
        },
        getBookProfileHandler,
    );
};
