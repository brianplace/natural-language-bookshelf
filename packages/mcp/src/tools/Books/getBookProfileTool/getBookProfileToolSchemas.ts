import z from 'zod';

export const getBookProfileInputSchema = {
    id: z.string().describe('The local database ID of the book'),
};

export const getBookProfileOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type GetBookProfileInput = { id: string };
export type GetBookProfileOutput = z.infer<typeof getBookProfileOutputSchema>;
