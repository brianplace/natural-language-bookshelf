import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall, setToken } from '../../../api';
import { newAccountInputSchema, NewAccountInput, NewAccountOutput } from './newAccountToolSchemas';

async function newAccountHandler({ email, password }: NewAccountInput): Promise<NewAccountOutput> {
    const res = await apiCall('post', '/auth/register', { email, password });
    setToken(res.data.token);
    return {
        content: [{ type: 'text', text: 'Account created and logged in' }],
    };
}

export const registerNewAccountTool = (server: McpServer) => {
    server.registerTool(
        'Register',
        {
            title: 'Register',
            description: 'Registers a new bookshelf account',
            inputSchema: newAccountInputSchema,
        },
        newAccountHandler,
    );
};
