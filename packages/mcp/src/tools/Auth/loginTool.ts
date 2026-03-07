import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall, setToken } from '../../api';
import z from 'zod';

export const registerLoginTool = (server: McpServer) => {
    server.registerTool(
        'Login',
        {
            title: 'Login',
            description: 'Login to your bookshelf account',
            inputSchema: { email: z.string().email(), password: z.string() },
        },
        async ({ email, password }) => {
            const res = await apiCall('post', '/auth/login', {
                email,
                password,
            });
            setToken(res.data.token);
            return {
                content: [{ type: 'text', text: 'Logged in successfully' }],
            };
        },
    );
};
