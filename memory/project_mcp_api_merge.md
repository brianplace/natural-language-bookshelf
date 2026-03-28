---
name: MCP + API merge — session summary
description: What was done, why, and what comes next after merging packages/api into packages/mcp
type: project
---

## What was done

`packages/api` (Express REST API) was merged into `packages/mcp` so that the MCP server is the **only** public interface to the application. Nothing talks to a database or runs business logic except through MCP tools.

**Why:** The user's goal is that all access to the application must go through MCP. The REST API was an unnecessary HTTP boundary — a network round-trip with a JWT handshake on every tool call, for no benefit since MCP was the only consumer.

## Current state (branch: `feature/merge-mcp-api`)

All work lives on this branch. It has not been merged to main yet.

### What was added to `packages/mcp`

- `prisma/` — schema and migrations moved from `packages/api/prisma/`
- `src/lib/prisma.ts` — PrismaClient singleton
- `src/lib/jwt.ts` — signToken / verifyToken
- `src/auth.ts` — replaces the old `api.ts`; holds session token in memory; `getUserId()` verifies JWT live on each call
- `src/services/authService.ts` — register, login (bcrypt + JWT)
- `src/services/bookService.ts` — all book operations including OpenLibrary calls
- `src/services/shelfService.ts` — all shelf/shelf-book operations with ownership checks
- `src/services/lendingService.ts` — listLentBooks
- `src/services/templateService.ts` — publish, unpublish, search, clone

### What changed in `packages/mcp`

- All 22 tool handlers migrated from `apiCall(...)` → `getUserId()` + direct service call
- `src/api.ts` deleted
- New dependencies: `bcrypt@^6.0.0`, `jsonwebtoken@^9.0.3`, `@prisma/client@^6.0.0`, `prisma@^6.0.0`
- `packages/mcp/.env` created (copy of `packages/api/.env` — same DATABASE_URL and JWT_SECRET)
- New scripts: `generate`, `migrate`, `studio`

### Root `package.json`

- `dev` script: was `pnpm --parallel -r dev` (started api + mcp + web), now `pnpm --filter mcp --filter web --parallel dev`
- `inspect` script: removed the `pnpm --filter api dev` process

### `packages/api` status

Still on disk, not deleted. Excluded from the dev script. Safe to delete after the branch is merged and validated.

## GitHub Actions / Secrets

The only GitHub environment secret required is `DATABASE_URL` (used in `promote.yml` for `prisma migrate deploy`). No other secrets are needed. This still needs to be configured in GitHub — it's a known TODO for later.

`MCP_URL` is not referenced anywhere and can be deleted from GitHub if it exists.

## Next steps

1. **Test the branch** — start `pnpm dev` from root, connect Claude Desktop to the MCP server, and exercise the tools (login, search, add to shelf, etc.)
2. **Open a PR** — merge `feature/merge-mcp-api` into `main`
3. **Delete `packages/api`** — after the PR is merged and validated
4. **Migrate `packages/web`** — currently unknown whether web still calls the REST API directly; if so, it needs to be updated to use MCP tools instead. This is a separate effort.
5. **Set up GitHub environment secret** — add `DATABASE_URL` to the `production` environment in GitHub repo settings.

## How to apply

When resuming work on this repo: check out `feature/merge-mcp-api` if it hasn't been merged yet. If it has been merged, `packages/api` can be deleted and web migration is the next priority.
