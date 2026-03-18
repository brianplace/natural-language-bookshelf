import z from 'zod';

export const newAccountInputSchema = {
    email: z.string().email().describe('The email address for the new account'),
    password: z.string().describe('The password for the new account'),
};

export type NewAccountInput = { email: string; password: string };

export const newAccountOutputResult = z.object({
    AccountCreated: z.boolean().describe('Flag that shows whether or not the account was successfully created'),
    LoggedIn: z.boolean().describe('Flag that shows whether or not the account was successfully logged into'),
    Errors: z.string().array().describe('List of errors that resulted from trying to register the account')
});

export type newAccountOutputType = z.infer<typeof newAccountOutputResult>;

export const newAccountOutputSchema = z.object({
    structuredContent: newAccountOutputResult,
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type NewAccountOutput = z.infer<typeof newAccountOutputSchema>;
