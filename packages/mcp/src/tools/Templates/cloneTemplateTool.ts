import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';
import { apiCall } from '../../api';

export const registerCloneTemplateTool = (server: McpServer) => {
    server.registerTool(
        'CloneTemplate',
        {
            title: 'Clone Template',
            description: 'Clone a community shelf template to your account',
            inputSchema: { shelfId: z.string() },
        },
        async ({ shelfId }) => {
            const res = await apiCall('post', `/templates/${shelfId}/clone`);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Template cloned as shelf "${res.data.name}" (ID: ${res.data.id})`,
                    },
                ],
            };
        },
    );
};
