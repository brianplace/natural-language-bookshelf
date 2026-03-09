import z from 'zod';

export const listLentBooksInputSchema = {};

export const listLentBooksOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type ListLentBooksInput = {};
export type ListLentBooksOutput = z.infer<typeof listLentBooksOutputSchema>;
