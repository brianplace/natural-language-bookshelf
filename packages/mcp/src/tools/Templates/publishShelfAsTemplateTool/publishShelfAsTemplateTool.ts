import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall } from '../../../api';
import { publishShelfAsTemplateInputSchema, PublishShelfAsTemplateInput, PublishShelfAsTemplateOutput } from './publishShelfAsTemplateToolSchemas';

async function publishShelfAsTemplateHandler({ shelfId }: PublishShelfAsTemplateInput): Promise<PublishShelfAsTemplateOutput> {
    await apiCall('post', `/templates/${shelfId}/publish`);
    return {
        content: [{ type: 'text', text: 'Shelf published as template.' }],
    };
}

export const registerPublishShelfAsTemplateTool = (server: McpServer) => {
    server.registerTool(
        'PublishShelfAsTemplate',
        {
            title: 'Publish Shelf as template',
            description: 'Make a shelf available as a template for other users to clone',
            inputSchema: publishShelfAsTemplateInputSchema,
        },
        publishShelfAsTemplateHandler,
    );
};
