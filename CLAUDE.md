# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bookshelf is a pnpm monorepo with four packages:

- **`packages/api`** — Express 5 REST API with Prisma ORM, JWT auth, bcrypt
- **`packages/web`** — Next.js 16 frontend with React 19, Tailwind CSS v4, AI SDK (Anthropic)
- **`packages/mcp`** — MCP (Model Context Protocol) server using `@modelcontextprotocol/sdk` and zod
- **`packages/shared`** — Shared TypeScript types (`Book`, `Shelf`, `ShelfBook`, `ApiResponse<T>`)

All packages import shared types via the workspace alias `@bookshelf/shared`.

## Commands

From the repo root:

```bash
pnpm install          # install all dependencies
pnpm dev              # run all packages in parallel (uses --parallel -r dev)
```

From an individual package directory:

```bash
pnpm dev              # start that package's dev server
```

The `api` and `mcp` packages use `ts-node-dev` for development. The `web` package uses the Next.js dev server.

## Key Tech Choices

- **Package manager**: pnpm with workspaces (`pnpm-workspace.yaml`)
- **TypeScript**: v5, used across all packages
- **Database**: Prisma (v6) — schema lives in `packages/api`
- **Auth**: JWT (`jsonwebtoken`) + password hashing (`bcrypt`) in `packages/api`
- **AI**: Vercel AI SDK (`@ai-sdk/anthropic`) in `packages/web`; MCP server in `packages/mcp` communicates with the API via `axios`
- **Styling**: Tailwind CSS v4 (PostCSS plugin approach)

## Shared Types

`packages/shared/src/index.ts` is the single source of truth for domain types. When adding or changing data shapes, update here first, then update consumers in `api` and `web`.
