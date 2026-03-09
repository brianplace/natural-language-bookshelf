import z from 'zod';

export const markAsReturnedInputSchema = {
    shelfId: z.string().describe('The ID of the shelf containing the lent book'),
    bookId: z.string().describe('The ID of the book being returned'),
};

export const markAsReturnedOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type MarkAsReturnedInput = { shelfId: string; bookId: string };
export type MarkAsReturnedOutput = z.infer<typeof markAsReturnedOutputSchema>;
