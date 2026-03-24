import z from 'zod';

export const getCollectionInputSchema = {};

export const getCollectionOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type GetCollectionInput = Record<string, never>;
export type GetCollectionOutput = z.infer<typeof getCollectionOutputSchema>;
