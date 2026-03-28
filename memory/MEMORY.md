# Bookshelf Project Memory

## Workflow Preferences

- [Always use feature branches](feedback_branching.md) — never commit directly to main

## MCP Server (packages/mcp)

### Transport Setup
- Uses `StreamableHTTPServerTransport` on port 3100 at `/mcp` endpoint
- A new `McpServer` instance must be created per connection — a single shared instance throws "Already connected to a transport"
- The `createServer()` function in `index.ts` handles this

### Tool Structure
- Each tool lives in its own folder: `tools/Category/toolName/`
  - `toolName.ts` — named handler function + `registerXxxTool(server)`
  - `toolNameSchemas.ts` — Zod input/output schemas, input/output types
- Output schemas are passed to `registerTool` via the `outputSchema` field

## Active Work

- [MCP + API merge](project_mcp_api_merge.md) — branch `feature/merge-mcp-api`, unmerged; full session summary and next steps
