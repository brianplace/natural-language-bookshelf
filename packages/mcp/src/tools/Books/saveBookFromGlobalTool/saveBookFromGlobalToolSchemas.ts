import z from 'zod';

export const saveBookFromGlobalInputSchema = {
    openLibraryId: z.string().describe('The Open Library identifier for the book, taken directly from the global search result'),
    title: z.string().describe('The title of the book; can be edited by the user if the search result title is incorrect or incomplete'),
    authors: z.array(z.string()).describe('The list of authors from the search result; the user may remove or edit entries if they are incorrect'),
    additionalAuthors: z.array(z.string()).optional().describe('Any additional author names to add beyond what was returned in the search result'),
    publishedDate: z.string().optional().describe('The publication date of the book'),
    isbn: z.string().optional().describe('The ISBN of the book'),
    thumbnail: z.string().optional().describe('URL to the book cover thumbnail image'),
};

export const saveBookFromGlobalOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type SaveBookFromGlobalInput = {
    openLibraryId: string;
    title: string;
    authors: string[];
    additionalAuthors?: string[];
    publishedDate?: string;
    isbn?: string;
    thumbnail?: string;
};
export type SaveBookFromGlobalOutput = z.infer<typeof saveBookFromGlobalOutputSchema>;
