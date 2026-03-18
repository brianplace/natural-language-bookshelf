import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall, setToken } from '../../../api';
import { newAccountInputSchema, NewAccountInput, NewAccountOutput, newAccountOutputSchema, newAccountOutputResult, newAccountOutputType } from './newAccountToolSchemas';

async function newAccountHandler({ email, password }: NewAccountInput): Promise<NewAccountOutput> {
    const res = await apiCall('post', '/auth/register', { email, password });
    const errorMessages: string[] = [];
    let token: string = '';
    let loggedIn: boolean = false;

    if (res.data?.token) {
        token = res.data.token;
    } else {
        errorMessages.push(...(res.errors ?? []));
    }

    if (token.length > 0) {
        setToken(token);
        loggedIn = true;
    }

    const resultingData: newAccountOutputType = {
        AccountCreated: token.length > 0,
        LoggedIn: loggedIn,
        Errors: errorMessages
    }

    return {
        structuredContent: resultingData,
        content: [{ type: 'text', text: JSON.stringify(resultingData, null, 2)}],
    };
}

export const registerNewAccountTool = (server: McpServer) => {
    server.registerTool(
        'Register',
        {
            title: 'Register',
            description: 'Registers a new bookshelf account',
            inputSchema: newAccountInputSchema,
            outputSchema: newAccountOutputResult
        },
        newAccountHandler,
    );
};
