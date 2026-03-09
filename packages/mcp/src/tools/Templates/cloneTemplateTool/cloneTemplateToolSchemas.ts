import z from 'zod';

export const cloneTemplateInputSchema = {
    shelfId: z.string().describe('The ID of the template shelf to clone'),
};

export const cloneTemplateOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type CloneTemplateInput = { shelfId: string };
export type CloneTemplateOutput = z.infer<typeof cloneTemplateOutputSchema>;
