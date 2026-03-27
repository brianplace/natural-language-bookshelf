import z from 'zod';

export const saveBookManuallyInputSchema = {
    title: z.string().describe('The title of the book'),
    authors: z.array(z.string().describe('An author name')).describe('List of author names'),
    openLibraryId: z.string().optional().describe('The Open Library identifier, if known; a unique ID is generated if omitted'),
    fullTitle: z.string().optional().describe('The full title including subtitle, if available'),
    description: z.string().optional().describe('A description or synopsis of the book'),
    publishedDate: z.string().optional().describe('The publication date of the book'),
    isbn10: z.string().optional().describe('The 10-digit ISBN of the book'),
    isbn13: z.string().optional().describe('The 13-digit ISBN of the book'),
    thumbnail: z.string().optional().describe('URL to the book cover thumbnail image'),
    format: z.string().optional().describe('The physical format, e.g. "Hardcover", "Paperback"'),
    type: z.string().optional().describe('The type identifier'),
    revision: z.number().optional().describe('The revision number of the edition'),
};

export const saveBookManuallyOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type SaveBookManuallyInput = {
    title: string;
    authors: string[];
    openLibraryId?: string;
    fullTitle?: string;
    description?: string;
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail?: string;
    format?: string;
    type?: string;
    revision?: number;
};
export type SaveBookManuallyOutput = z.infer<typeof saveBookManuallyOutputSchema>;
