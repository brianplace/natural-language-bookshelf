import z from 'zod';

export const addToCollectionInputSchema = {
    bookId: z.string().describe('The database ID of the book to add to the user\'s collection'),
};

export const addToCollectionOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type AddToCollectionInput = {
    bookId: string;
};
export type AddToCollectionOutput = z.infer<typeof addToCollectionOutputSchema>;
