import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';
import axios from 'axios';

const ImageReturnSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal('image'),
            data: z.string().describe('Base64 encoded image data'),
            mimeType: z
                .string()
                .describe("MIME type of the image (e.g., 'image/png')"),
        }),
    ),
});

// Infer the TypeScript type
type ImageReturn = z.infer<typeof ImageReturnSchema>;

export const registerGetImageTool = (server: McpServer) => {
    server.registerTool(
        'GetImage',
        {
            title: 'Get Image',
            description: 'Return the image based off a url',
            inputSchema: { imageURL: z.string() },
            // outputSchema: ImageReturnSchema,
        },
        async ({ imageURL }) => {
            try {
                const response = await axios.get(imageURL, {
                    responseType: 'arraybuffer',
                });

                const base64 = Buffer.from(response.data).toString('base64');
                const contentType =
                    response.headers['content-type'] || 'image/jpeg';

                return {
                    content: [
                        {
                            type: 'image',
                            data: base64,
                            mimeType: contentType,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        { type: 'text', text: 'Failed to fetch book cover' },
                    ],
                };
            }
        },
    );
};
