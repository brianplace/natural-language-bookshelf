import z from 'zod';

export const createShelfInputSchema = {
    name: z.string().describe('The name of the new shelf'),
};

export const createShelfOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type CreateShelfInput = { name: string };
export type CreateShelfOutput = z.infer<typeof createShelfOutputSchema>;
