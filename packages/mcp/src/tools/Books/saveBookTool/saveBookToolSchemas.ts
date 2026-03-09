import z from 'zod';

export const saveBookInputSchema = {
    openLibraryId: z.string().describe('The Open Library identifier for the book'),
    title: z.string().describe('The title of the book'),
    authors: z.array(z.string().describe('An author name')).describe('List of author names'),
    publishedDate: z.string().optional().describe('The publication date of the book'),
    isbn: z.string().optional().describe('The ISBN of the book'),
    thumbnail: z.string().optional().describe('URL to the book cover thumbnail image'),
};

export const saveBookOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type SaveBookInput = {
    openLibraryId: string;
    title: string;
    authors: string[];
    publishedDate?: string;
    isbn?: string;
    thumbnail?: string;
};
export type SaveBookOutput = z.infer<typeof saveBookOutputSchema>;
