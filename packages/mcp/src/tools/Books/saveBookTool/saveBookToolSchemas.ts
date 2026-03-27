import z from 'zod';

export const saveBookInputSchema = {
    openLibraryId: z.string().describe('The Open Library identifier for the book'),
    title: z.string().describe('The title of the book'),
    fullTitle: z.string().optional().describe('The full title of the book including subtitle, if available'),
    authors: z.array(z.string().describe('An author name')).describe('List of author names'),
    publishedDate: z.string().optional().describe('The publication date of the book'),
    isbn10: z.string().optional().describe('The 10-digit ISBN of the book'),
    isbn13: z.string().optional().describe('The 13-digit ISBN of the book'),
    thumbnail: z.string().optional().describe('URL to the book cover thumbnail image'),
    format: z.string().optional().describe('The physical format of the book, e.g. "Hardcover", "Paperback"'),
    type: z.string().optional().describe('The type identifier from Open Library'),
    revision: z.number().optional().describe('The revision number of the edition'),
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
    fullTitle?: string;
    authors: string[];
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail?: string;
    format?: string;
    type?: string;
    revision?: number;
};
export type SaveBookOutput = z.infer<typeof saveBookOutputSchema>;
