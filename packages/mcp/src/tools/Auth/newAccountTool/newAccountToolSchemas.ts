import z from 'zod';

export const newAccountInputSchema = {
    email: z.string().email().describe('The email address for the new account'),
    password: z.string().describe('The password for the new account'),
};

export const newAccountOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type NewAccountInput = { email: string; password: string };
export type NewAccountOutput = z.infer<typeof newAccountOutputSchema>;
