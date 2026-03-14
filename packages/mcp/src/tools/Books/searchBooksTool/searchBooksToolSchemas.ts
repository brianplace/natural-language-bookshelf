import z from 'zod';

export const searchBooksInputSchema = {
    // query: z.string().describe('The search query to find books by title, author, or keyword'),
    title: z.string().optional().describe('The title of the book being searched'),
    author: z.string().optional().describe('The name of the author being searched')
};

export const searchBooksOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

// export type SearchBooksInput = { query: string };
export type SearchBooksInput = z.infer<typeof searchBooksInputSchema>;
export type SearchBooksOutput = z.infer<typeof searchBooksOutputSchema>;

export interface TextResult {
    type: 'text';
    text: string;
}

export interface ImageResult {
    type: 'image';
    source: {
        type: 'url';
        url: string;
    };
}

export type BookSearchResult = TextResult | ImageResult;
