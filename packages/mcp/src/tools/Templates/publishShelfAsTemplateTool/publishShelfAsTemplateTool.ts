import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { publishTemplate } from '../../../services/templateService';
import { publishShelfAsTemplateInputSchema, PublishShelfAsTemplateInput, PublishShelfAsTemplateOutput } from './publishShelfAsTemplateToolSchemas';

async function publishShelfAsTemplateHandler({ shelfId }: PublishShelfAsTemplateInput): Promise<PublishShelfAsTemplateOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        await publishTemplate(userId, shelfId);
        return {
            content: [{ type: 'text', text: 'Shelf published as template.' }],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error publishing template: ${error.message}` }] };
    }
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
