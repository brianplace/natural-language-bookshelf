# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bookshelf is a pnpm monorepo with three active packages:

- **`packages/mcp`** — The single backend: MCP server + Prisma ORM + all business logic. This is the only entry point to the data layer. Port 3100.
- **`packages/web`** — Next.js 16 frontend with React 19, Tailwind CSS v4, AI SDK (Anthropic). Port 3000.
- **`packages/shared`** — Shared TypeScript types (`Book`, `Shelf`, `ShelfBook`, `ApiResponse<T>`)

`packages/api` exists on disk but is retired — do not start it or add to it.

## Commands

From the repo root:

```bash
pnpm install          # install all dependencies
pnpm dev              # run mcp + web in parallel
pnpm inspect          # run mcp + MCP inspector UI for tool testing
```

From `packages/mcp`:

```bash
pnpm dev              # start MCP server with ts-node-dev (hot reload)
pnpm build            # tsc compile check
pnpm generate         # regenerate Prisma client after schema changes
pnpm migrate          # run prisma migrate dev
pnpm studio           # open Prisma Studio
```

## Architecture

### MCP server is the only backend

All database access, auth, and business logic lives in `packages/mcp`. Nothing else touches the database directly. `packages/web` must go through MCP tools — it does not call any REST API.

### Internal structure of `packages/mcp/src/`

```
auth.ts              — session token storage; getUserId() verifies JWT on each call
lib/jwt.ts           — signToken / verifyToken
lib/prisma.ts        — PrismaClient singleton
services/            — pure async functions: all business logic lives here
  authService.ts     — register, login (bcrypt + JWT)
  bookService.ts     — search (local + OpenLibrary), save, collection
  shelfService.ts    — CRUD + ownership checks for shelves and shelf-books
  lendingService.ts  — listLentBooks
  templateService.ts — publish, unpublish, search, clone
tools/               — MCP tool handlers, one folder per tool
  Auth/
  Books/
  Shelves/
  Templates/         — registered but disabled in index.ts
  Images/            — disabled
index.ts             — HTTP server (port 3100), tool registration
prisma/              — schema.prisma + migrations
```

### Tool structure pattern

Each tool lives in `tools/Category/toolName/` with two files:
- `toolName.ts` — handler function + `registerXxxTool(server)` export
- `toolNameSchemas.ts` — Zod input/output schemas and inferred types

Tool handlers always follow this pattern:
1. Call `getUserId()` in a try/catch — return an error content block if not authenticated
2. Call the relevant service function in a try/catch — return an error content block on failure
3. Return `{ content: [{ type: 'text', text: ... }] }` on success

### Auth flow

- Login/register tools call `authService` directly, then call `setToken(token)` from `auth.ts`
- `getUserId()` calls `verifyToken(authToken)` live on each invocation — it throws if the token is expired or missing
- The token is stored as a process-level module variable (single session per process)

### Adding a new tool

1. Create `tools/Category/myTool/myToolSchemas.ts` with Zod input schema and TypeScript types
2. Create `tools/Category/myTool/myTool.ts` with handler + `registerMyTool(server)`
3. Add service logic to the appropriate `services/*.ts` file
4. Import and call `registerMyTool(server)` in `index.ts`

### Shared types

`packages/shared/src/index.ts` is the source of truth for cross-package domain types. Update it first when changing data shapes, then update consumers in `web`.

## Key dependencies

- **MCP SDK**: `@modelcontextprotocol/sdk` — `McpServer`, `StreamableHTTPServerTransport`
- **ORM**: Prisma v6 — schema in `packages/mcp/prisma/schema.prisma`
- **Auth**: `jsonwebtoken` v9 + `bcrypt` v6
- **External API**: OpenLibrary (`https://openlibrary.org`) — used in `bookService.ts` for global search and edition fetching via `axios`
- **AI (web)**: Vercel AI SDK (`@ai-sdk/anthropic`)
- **Styling (web)**: Tailwind CSS v4 (PostCSS plugin approach)

## Environment variables

`packages/mcp/.env` must contain:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
```
