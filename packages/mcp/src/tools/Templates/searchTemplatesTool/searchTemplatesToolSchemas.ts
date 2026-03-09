import z from 'zod';

export const searchTemplatesInputSchema = {
    query: z.string().optional().describe('Optional search query to filter community templates'),
};

export const searchTemplatesOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type SearchTemplatesInput = { query?: string };
export type SearchTemplatesOutput = z.infer<typeof searchTemplatesOutputSchema>;
