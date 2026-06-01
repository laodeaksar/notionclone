---
name: wrangler dev configuration for Replit
description: Required wrangler.toml settings to make wrangler dev work correctly inside Replit's workflow environment
---

## Problem
Replit's workflow system checks that a port is opened to consider a workflow "running". Wrangler dev by default binds to `localhost` (127.0.0.1) and port 8787. Replit's port checker expects port 3000 and may need 0.0.0.0 binding.

## Fix
Add a `[dev]` section to `apps/api/wrangler.toml`:

```toml
[dev]
port = 3000
ip = "0.0.0.0"
```

Also set `compatibility_date` to a date within the installed wrangler's supported range:
```toml
compatibility_date = "2025-07-18"
```
(wrangler 3.x supports up to `2025-07-18`; setting a future date causes a warning and fallback)

**Why:** Replit detects workflow health by checking if port 3000 opens with a TCP bind. `127.0.0.1` only binds to loopback; `0.0.0.0` binds to all interfaces and is detectable by the platform's port scanner.

**How to apply:** Whenever a new Hono/Cloudflare Worker app is set up as a Replit workflow.
