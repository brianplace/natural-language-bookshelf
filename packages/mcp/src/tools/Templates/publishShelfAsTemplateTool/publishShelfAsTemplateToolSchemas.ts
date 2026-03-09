import z from 'zod';

export const publishShelfAsTemplateInputSchema = {
    shelfId: z.string().describe('The ID of the shelf to publish as a template'),
};

export const publishShelfAsTemplateOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text').describe(''),
            text: z.string().describe(''),
        }),
    ).describe(''),
});

export type PublishShelfAsTemplateInput = { shelfId: string };
export type PublishShelfAsTemplateOutput = z.infer<typeof publishShelfAsTemplateOutputSchema>;
