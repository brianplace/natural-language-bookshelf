import z from 'zod';

export const loginInputSchema = {
    email: z.string().email().describe('The email address of the user account'),
    password: z.string().describe('The password for the user account'),
};

export const loginOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type LoginInput = { email: string; password: string };
export type LoginOutput = z.infer<typeof loginOutputSchema>;
