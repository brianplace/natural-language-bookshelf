---
name: CI build failures in packages/api
description: Two TypeScript build errors causing CI to fail on the api package
type: project
---

Two errors break `pnpm build` for `@bookshelf/api` in CI:

1. **`src/lib/prisma.ts:3`** — `Module '"@prisma/client"' has no exported member 'PrismaClient'`
   - Root cause: `prisma generate` is not run before `tsc` in CI, so the generated client types don't exist.
   - Fix: add a `prisma generate` step before the build in the CI workflow, or add it as a `prebuild` script in `packages/api/package.json`.

2. **`src/routes/templates.ts:113`** — `Parameter 'b' implicitly has an 'any' type`
   - Root cause: a sort/filter callback is missing an explicit type annotation on parameter `b`.
   - Fix: add the appropriate type to the callback parameter.

**How to apply:** Address both before merging any PR that touches the API build.
