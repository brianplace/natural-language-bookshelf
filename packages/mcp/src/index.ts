import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import http from 'http';
import { apiCall, setToken } from './api';
import { registerLoginTool } from './tools/Auth/loginTool/loginTool';
import { registerNewAccountTool } from './tools/Auth/newAccountTool/newAccountTool';
import { registerSearchBooksTool } from './tools/Books/searchBooksTool/searchBooksTool';
import { registerSaveBookTool } from './tools/Books/saveBookTool/saveBookTool';
import { registerCreateShelfTool } from './tools/Shelves/createShelfTool/createShelfTool';
import { registerListShelvesTool } from './tools/Shelves/listShelvesTool/listShelvesTool';
import { registerRenameShelfTool } from './tools/Shelves/renameShelfTool/renameShelfTool';
import { registerDeleteShelfTool } from './tools/Shelves/deleteShelfTool/deleteShelfTool';
import { registerAddBookToShelfTool } from './tools/Shelves/addBookToShelfTool/addBookToShelfTool';
import { registerRemoveBookFromShelfTool } from './tools/Shelves/removeBookFromShelfTool/removeBookFromShelfTool';
import { registerMoveBookTool } from './tools/Shelves/moveBookTool/moveBookTool';
import { registerMarkAsLentTool } from './tools/Shelves/markAsLentTool/markAsLentTool';
import { registerMarkAsReturnedTool } from './tools/Shelves/markAsReturnedTool/markAsReturnedTool';
import { registerListLentBooksTool } from './tools/Shelves/listLentBooksTool/listLentBooksTool';
import { registerPublishShelfAsTemplateTool } from './tools/Templates/publishShelfAsTemplateTool/publishShelfAsTemplateTool';
import { registerSearchTemplatesTool } from './tools/Templates/searchTemplatesTool/searchTemplatesTool';
import { registerCloneTemplateTool } from './tools/Templates/cloneTemplateTool/cloneTemplateTool';
import { registerGetImageTool } from './tools/Images/getImageTool/getImageTool';

const createServer = () => {
    const server = new McpServer({
        name: 'bookshelf',
        version: '0.0.1',
    });

    // --- Auth ---
    registerLoginTool(server);
    registerNewAccountTool(server);

    // --- Books ---
    registerSearchBooksTool(server);
    registerSaveBookTool(server);

    // --- Shelves ---
    registerCreateShelfTool(server);
    registerListShelvesTool(server);
    registerRenameShelfTool(server);
    registerDeleteShelfTool(server);
    registerAddBookToShelfTool(server);
    registerRemoveBookFromShelfTool(server);
    registerMoveBookTool(server);
    registerMarkAsLentTool(server);
    registerMarkAsReturnedTool(server);
    registerListLentBooksTool(server);

    // --- Templates ---
    registerPublishShelfAsTemplateTool(server);
    registerSearchTemplatesTool(server);
    registerCloneTemplateTool(server);

    registerGetImageTool(server);

    return server;
};

// Start the server
const httpServer = http.createServer(async (req, res) => {
    if (req.url === '/mcp') {
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        await createServer().connect(transport);
        await transport.handleRequest(req, res);
    } else {
        res.writeHead(404).end();
    }
});

const PORT = process.env.PORT || 3100;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.error(`Bookshelf MCP server running on port ${PORT}`);
});
