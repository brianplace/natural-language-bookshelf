# Bookshelf Project Memory

## MCP Server (packages/mcp)

### Remote Access Setup
- Uses `StreamableHTTPServerTransport` on port 3100 at `/mcp` endpoint (not SSE/stdio)
- A new `McpServer` instance must be created per connection — a single shared instance throws "Already connected to a transport"
- The `createServer()` function in `index.ts` handles this

### Tool Structure
- Each tool lives in its own folder: `tools/Category/toolName/`
  - `toolName.ts` — named handler function + `registerXxxTool(server)`
  - `toolNameSchemas.ts` — input/output zod schemas with `.describe()`, input/output types
- Output schemas are passed to `registerTool` via the `outputSchema` field

## Feedback

- [feedback_branching.md](feedback_branching.md) — Always use feature branches, never commit directly to main

## Known Issues

- [project_ci_failures.md](project_ci_failures.md) — CI build failures in `packages/api` to fix
