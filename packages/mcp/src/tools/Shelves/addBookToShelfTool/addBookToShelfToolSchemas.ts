import z from 'zod';

export const addBookToShelfInputSchema = {
    shelfId: z.string().describe('The ID of the shelf to add the book to'),
    bookId: z.string().describe('The ID of the book to add'),
};

export const addBookToShelfOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type AddBookToShelfInput = { shelfId: string; bookId: string };
export type AddBookToShelfOutput = z.infer<typeof addBookToShelfOutputSchema>;
