import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { getUserId } from '../../../auth';
import { cloneTemplate } from '../../../services/templateService';
import { cloneTemplateInputSchema, CloneTemplateInput, CloneTemplateOutput } from './cloneTemplateToolSchemas';

async function cloneTemplateHandler({ shelfId }: CloneTemplateInput): Promise<CloneTemplateOutput> {
    let userId: string;
    try {
        userId = getUserId();
    } catch (error: any) {
        return { content: [{ type: 'text', text: error.message }] };
    }

    try {
        const shelf = await cloneTemplate(userId, shelfId);
        return {
            content: [
                { type: 'text', text: `Template cloned as shelf "${shelf.name}" (ID: ${shelf.id})` },
            ],
        };
    } catch (error: any) {
        return { content: [{ type: 'text', text: `Error cloning template: ${error.message}` }] };
    }
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
