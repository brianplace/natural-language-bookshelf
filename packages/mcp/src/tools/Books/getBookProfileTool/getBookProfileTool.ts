import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { getBookProfileInputSchema, GetBookProfileInput, GetBookProfileOutput } from './getBookProfileToolSchemas';

async function getBookProfileHandler(input: GetBookProfileInput): Promise<GetBookProfileOutput> {
    const res = await apiCall('get', `/books/${input.id}`, {});

    return {
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(res.data, null, 2),
            },
        ],
    };
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
