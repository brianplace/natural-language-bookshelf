import z from 'zod';

export const getImageInputSchema = {
    imageURL: z.string().describe('The URL of the image to fetch'),
};

export const getImageOutputSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('image').describe(''),
            data: z.string().describe('Base64 encoded image data'),
            mimeType: z.string().describe("MIME type of the image (e.g., 'image/png')"),
        }),
    ).describe(''),
});

const getImageOutputErrorSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('text'),
            text: z.string()
        })
    )
})

export type GetImageInput = { imageURL: string };
export type GetImageOutput = z.infer<typeof getImageOutputSchema> | z.infer<typeof getImageOutputErrorSchema>;
