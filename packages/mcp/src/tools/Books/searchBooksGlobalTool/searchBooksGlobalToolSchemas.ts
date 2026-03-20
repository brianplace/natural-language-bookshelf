import z from 'zod';

export const searchBooksGlobalInputSchema = z.object({
    // query: z.string().describe('The search query to find books by title, author, or keyword'),
    title: z.string().optional().describe('The title of the book being searched'),
    author: z.string().optional().describe('The name of the author being searched'),
    isbn10: z.string().optional().describe('The 10 digit ISBN code to search for; should be 10 numerical characters only; if a value is provided, then the isbn13 input field should be empty'),
    isbn13: z.string().optional().describe('The 13 digit ISBN code to search for; should be 13 numerical characters only; if a value is provided, then the isbn10 input field should be empty')
});

export const searchBooksGlobalOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type SearchBooksGlobalInput = z.infer<typeof searchBooksGlobalInputSchema>;
export type SearchBooksGlobalOutput = z.infer<typeof searchBooksGlobalOutputSchema>;

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

export type BookSearchGlobalResult = TextResult | ImageResult;
