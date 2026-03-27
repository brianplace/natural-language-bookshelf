import z from 'zod';

export const getEditionsFromGlobalSearchInputSchema = z.object({
    openLibraryId: z.string().describe('The OpenLibrary ID of the work (e.g. /works/OL45804W) to retrieve all editions for'),
});

export const getEditionsFromGlobalSearchOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type GetEditionsFromGlobalSearchInput = z.infer<typeof getEditionsFromGlobalSearchInputSchema>;
export type GetEditionsFromGlobalSearchOutput = z.infer<typeof getEditionsFromGlobalSearchOutputSchema>;
