import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall, setToken } from '../../../api';
import { loginInputSchema, LoginInput, LoginOutput } from './loginToolSchemas';

async function loginHandler({ email, password }: LoginInput): Promise<LoginOutput> {
    const res = await apiCall('post', '/auth/login', { email, password });
    setToken(res.data.token);
    return {
        content: [{ type: 'text', text: 'Logged in successfully' }],
    };
}

export const registerLoginTool = (server: McpServer) => {
    server.registerTool(
        'Login',
        {
            title: 'Login',
            description: 'Login to your bookshelf account',
            inputSchema: loginInputSchema,
        },
        loginHandler,
    );
};
