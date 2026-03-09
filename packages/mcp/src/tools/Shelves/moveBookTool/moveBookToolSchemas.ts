import z from 'zod';

export const moveBookInputSchema = {
    fromShelfId: z.string().describe('The ID of the shelf to move the book from'),
    toShelfId: z.string().describe('The ID of the shelf to move the book to'),
    bookId: z.string().describe('The ID of the book to move'),
};

export const moveBookOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type MoveBookInput = { fromShelfId: string; toShelfId: string; bookId: string };
export type MoveBookOutput = z.infer<typeof moveBookOutputSchema>;
