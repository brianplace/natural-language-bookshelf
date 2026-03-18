import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { apiCall, setToken } from '../../../api';
import { createNewAccountInputSchema, CreateNewAccountInput, CreateNewAccountOutput, createNewAccountOutputType, createNewAccountOutputSchema, createNewAccountOutputResult } from './createNewAccountToolSchemas';

async function createNewAccountHandler({ email, password }: CreateNewAccountInput): Promise<CreateNewAccountOutput> {
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

    const resultingData: createNewAccountOutputType = {
        AccountCreated: token.length > 0,
        LoggedIn: loggedIn,
        Errors: errorMessages
    }

    return {
        structuredContent: resultingData,
        content: [{ type: 'text', text: JSON.stringify(resultingData, null, 2)}],
    };
}

export const registerCreateNewAccountTool = (server: McpServer) => {
    server.registerTool(
        'CreateNewAccount',
        {
            title: 'Create New Account',
            description: 'Allows the user to create a new account when the username and password do not already exist in the system',
            inputSchema: createNewAccountInputSchema,
            outputSchema: createNewAccountOutputResult
        },
        createNewAccountHandler,
    );
};
