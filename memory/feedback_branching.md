---
name: Always use feature branches
description: Never commit directly to main — always branch, PR, then merge
type: feedback
---

Always work on a feature branch, not directly on main.

**Why:** The repo's intended flow is branch → PR → merge to main → promote to production. CI runs on PRs to catch issues before they land on main.

**How to apply:** For any code change, create a new branch first. Only commit directly to main for trivial config/documentation if explicitly instructed.
