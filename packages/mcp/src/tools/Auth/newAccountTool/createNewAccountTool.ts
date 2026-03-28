import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { setToken } from '../../../auth';
import { register } from '../../../services/authService';
import { createNewAccountInputSchema, CreateNewAccountInput, CreateNewAccountOutput, createNewAccountOutputType, createNewAccountOutputSchema, createNewAccountOutputResult } from './createNewAccountToolSchemas';

async function createNewAccountHandler({ email, password }: CreateNewAccountInput): Promise<CreateNewAccountOutput> {
    const errorMessages: string[] = [];
    let token: string = '';
    let loggedIn: boolean = false;

    try {
        const result = await register(email, password);
        token = result.token;
        setToken(token);
        loggedIn = true;
    } catch (error: any) {
        errorMessages.push(error.message);
    }

    const resultingData: createNewAccountOutputType = {
        AccountCreated: token.length > 0,
        LoggedIn: loggedIn,
        Errors: errorMessages,
    };

    return {
        structuredContent: resultingData,
        content: [{ type: 'text', text: JSON.stringify(resultingData, null, 2) }],
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
