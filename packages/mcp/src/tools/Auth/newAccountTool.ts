import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import z from 'zod';
import { apiCall, setToken } from '../../api';

export const registerNewAccountTool = (server: McpServer) => {
    server.registerTool(
        'Register',
        {
            title: 'Register',
            description: 'Registers a new bookshelf account',
            inputSchema: { email: z.string().email(), password: z.string() },
        },
        async ({ email, password }) => {
            const res = await apiCall('post', '/auth/register', {
                email,
                password,
            });
            setToken(res.data.token);
            return {
                content: [
                    { type: 'text', text: 'Account created and logged in' },
                ],
            };
        },
    );
};
