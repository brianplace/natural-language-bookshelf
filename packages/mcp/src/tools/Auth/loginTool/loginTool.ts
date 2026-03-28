import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { setToken } from '../../../auth';
import { login } from '../../../services/authService';
import { loginInputSchema, LoginInput, LoginOutput } from './loginToolSchemas';

async function loginHandler({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
        const { token } = await login(email, password);
        setToken(token);
        return {
            content: [{ type: 'text', text: 'Logged in successfully' }],
        };
    } catch (error: any) {
        return {
            content: [{ type: 'text', text: `Login failed: ${error.message}` }],
        };
    }
}

export const registerLoginTool = (server: McpServer) => {
    server.registerTool(
        'Login',
        {
            title: 'Login',
            description: 'Login to your bookshelf account; if login fails because the username/password don\'t exist, user can create an account through the createNewAccountTool',
            inputSchema: loginInputSchema,
        },
        loginHandler,
    );
};
