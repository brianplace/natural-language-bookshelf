import z from 'zod';

export const listShelvesInputSchema = z.object({});

export const listShelvesOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type ListShelvesInput = {};
export type ListShelvesOutput = z.infer<typeof listShelvesOutputSchema>;
