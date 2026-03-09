import z from 'zod';

export const renameShelfInputSchema = {
    shelfId: z.string().describe('The ID of the shelf to rename'),
    name: z.string().describe('The new name for the shelf'),
};

export const renameShelfOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type RenameShelfInput = { shelfId: string; name: string };
export type RenameShelfOutput = z.infer<typeof renameShelfOutputSchema>;
