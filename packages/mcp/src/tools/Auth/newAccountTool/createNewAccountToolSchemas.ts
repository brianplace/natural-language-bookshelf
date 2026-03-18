import z from 'zod';

export const createNewAccountInputSchema = {
    email: z.string().email().describe('The email address for the new account'),
    password: z.string().describe('The password for the new account'),
};

export type CreateNewAccountInput = { email: string; password: string };

export const createNewAccountOutputResult = z.object({
    AccountCreated: z.boolean().describe('Flag that shows whether or not the account was successfully created'),
    LoggedIn: z.boolean().describe('Flag that shows whether or not the account was successfully logged into'),
    Errors: z.string().array().describe('List of errors that resulted from trying to register the account')
});

export type createNewAccountOutputType = z.infer<typeof createNewAccountOutputResult>;

export const createNewAccountOutputSchema = z.object({
    structuredContent: createNewAccountOutputResult,
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type CreateNewAccountOutput = z.infer<typeof createNewAccountOutputSchema>;
