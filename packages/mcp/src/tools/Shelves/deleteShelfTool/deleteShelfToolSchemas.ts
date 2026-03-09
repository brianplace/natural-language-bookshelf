import z from 'zod';

export const deleteShelfInputSchema = {
    shelfId: z.string().describe('The ID of the shelf to delete'),
};

export const deleteShelfOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type DeleteShelfInput = { shelfId: string };
export type DeleteShelfOutput = z.infer<typeof deleteShelfOutputSchema>;
