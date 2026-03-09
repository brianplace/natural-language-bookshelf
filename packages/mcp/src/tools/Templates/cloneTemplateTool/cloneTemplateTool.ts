import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { cloneTemplateInputSchema, CloneTemplateInput, CloneTemplateOutput } from './cloneTemplateToolSchemas';

async function cloneTemplateHandler({ shelfId }: CloneTemplateInput): Promise<CloneTemplateOutput> {
    const res = await apiCall('post', `/templates/${shelfId}/clone`);
    return {
        content: [
            { type: 'text', text: `Template cloned as shelf "${res.data.name}" (ID: ${res.data.id})` },
        ],
    };
}

export const registerCloneTemplateTool = (server: McpServer) => {
    server.registerTool(
        'CloneTemplate',
        {
            title: 'Clone Template',
            description: 'Clone a community shelf template to your account',
            inputSchema: cloneTemplateInputSchema,
        },
        cloneTemplateHandler,
    );
};
