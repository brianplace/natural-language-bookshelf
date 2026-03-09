import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import axios from 'axios';
import { getImageInputSchema, GetImageInput, GetImageOutput } from './getImageToolSchemas';

async function getImageHandler({ imageURL }: GetImageInput): Promise<GetImageOutput> {
    try {
        const response = await axios.get(imageURL, {
            responseType: 'arraybuffer',
        });

        const base64 = Buffer.from(response.data).toString('base64');
        const contentType = response.headers['content-type'] || 'image/jpeg';

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
            content: [{ type: 'text', text: 'Failed to fetch book cover' }],
        };
    }
}

export const registerGetImageTool = (server: McpServer) => {
    server.registerTool(
        'GetImage',
        {
            title: 'Get Image',
            description: 'Return the image based off a url',
            inputSchema: getImageInputSchema,
        },
        getImageHandler,
    );
};
