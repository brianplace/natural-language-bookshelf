import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { apiCall, setToken } from './api';
import { registerLoginTool } from './tools/Auth/loginTool';
import { registerNewAccountTool } from './tools/Auth/newAccountTool';
import { registerSearchBooksTool } from './tools/Books/searchBooksTool';
import { registerSaveBookTool } from './tools/Books/saveBookTool';
import { registerCreateShelfTool } from './tools/Shelves/createShelfTool';
import { registerListShelvesTool } from './tools/Shelves/listShelvesTool';
import { registerRenameShelfTool } from './tools/Shelves/renameShelfTool';
import { registerDeleteShelfTool } from './tools/Shelves/deleteShelfTool';
import { registerAddBookToShelfTool } from './tools/Shelves/addBookToShelfTool';
import { registerRemoveBookFromShelfTool } from './tools/Shelves/removeBookFromShelfTool';
import { registerMoveBookTool } from './tools/Shelves/moveBookTool';
import { registerMarkAsLentTool } from './tools/Shelves/markAsLentTool';
import { registerMarkAsReturnedTool } from './tools/Shelves/markAsReturnedTool';
import { registerListLentBooksTool } from './tools/Shelves/listLentBooksTool';
import { registerPublishShelfAsTemplateTool } from './tools/Templates/publishShelfAsTemplateTool';
import { registerSearchTemplatesTool } from './tools/Templates/searchTemplatesTool';
import { registerCloneTemplateTool } from './tools/Templates/cloneTemplateTool';
import { registerGetImageTool } from './tools/Images/getImageTool';

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

// Start the server
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
    console.error('Bookshelf MCP server running');
});
