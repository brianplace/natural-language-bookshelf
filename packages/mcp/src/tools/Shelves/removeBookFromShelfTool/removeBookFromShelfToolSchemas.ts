import z from 'zod';

export const removeBookFromShelfInputSchema = {
    shelfId: z.string().describe('The ID of the shelf to remove the book from'),
    bookId: z.string().describe('The ID of the book to remove'),
};

export const removeBookFromShelfOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type RemoveBookFromShelfInput = { shelfId: string; bookId: string };
export type RemoveBookFromShelfOutput = z.infer<typeof removeBookFromShelfOutputSchema>;
