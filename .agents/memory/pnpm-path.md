---
name: pnpm PATH setup
description: How to invoke pnpm correctly in this Replit environment — Node.js 22 must be explicit in PATH.
---

The pnpm binary is installed at `/home/runner/workspace/.npm-global/bin/pnpm` but requires Node.js to be explicitly in PATH to run. The correct prefix for any shell command is:

```
NODE_BIN="/nix/store/bl6iwirn83qj9r8wng43kfdqd5mfahj8-nodejs-22.22.0/bin"
export PATH="$NODE_BIN:/home/runner/workspace/.npm-global/bin:$PATH"
```

**Why:** The Replit environment PATH does not include Node.js 22 or npm-global by default when the shell is spawned for workflows. The pnpm shebang (`#!/usr/bin/env node`) fails silently if `node` is not on PATH.

**How to apply:** Every workflow command and every bash command that needs pnpm must use this prefix. The configured workflows in `.replit` already have it baked into their `args`.
