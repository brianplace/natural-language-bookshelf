import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';
import { apiCall } from '../../api';

export const registerPublishShelfAsTemplateTool = (server: McpServer) => {
    server.registerTool(
        'PublishShelfAsTemplate',
        {
            title: 'Publish Shelf as template',
            description:
                'Make a shelf available as a template for other users to clone',
            inputSchema: { shelfId: z.string() },
        },
        async ({ shelfId }) => {
            await apiCall('post', `/templates/${shelfId}/publish`);
            return {
                content: [
                    { type: 'text', text: 'Shelf published as template.' },
                ],
            };
        },
    );
};
