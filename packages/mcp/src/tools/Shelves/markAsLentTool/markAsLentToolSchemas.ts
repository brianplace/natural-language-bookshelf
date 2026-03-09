import z from 'zod';

export const markAsLentInputSchema = {
    shelfId: z.string().describe('The ID of the shelf containing the book'),
    bookId: z.string().describe('The ID of the book to mark as lent'),
    lentTo: z.string().describe('The name of the person the book is being lent to'),
};

export const markAsLentOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type MarkAsLentInput = { shelfId: string; bookId: string; lentTo: string };
export type MarkAsLentOutput = z.infer<typeof markAsLentOutputSchema>;
