---
name: wrangler dev configuration for Replit
description: Required wrangler.toml settings to make wrangler dev work correctly inside Replit's workflow environment
---

## Problem 1 — Port binding
Replit's workflow system checks that a port is opened to consider a workflow "running". Wrangler dev by default binds to `localhost` (127.0.0.1) and port 8787. Replit's port checker expects port 3000 and needs 0.0.0.0 binding.

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

**Why:** Replit detects workflow health by checking if port 3000 opens with a TCP bind. `127.0.0.1` only binds to loopback; `0.0.0.0` binds to all interfaces and is detectable by the platform's port scanner.

---

## Problem 2 — Replit domain rotation (causes "always login again")
Replit **changes the dev domain** when the repl restarts. The `[env.dev.vars]` section in `wrangler.toml` hardcodes the old domain for `BETTER_AUTH_URL` and `ALLOWED_ORIGINS`. When the domain rotates:
- Better-auth generates session cookies bound to the old URL → sessions immediately invalid
- CORS blocks auth requests from the new domain → `getSession()` fails → redirect to `/login`

## Fix
Every time the Replit domain changes, update `apps/api/wrangler.toml` `[env.dev.vars]`:

```toml
[env.dev.vars]
BETTER_AUTH_URL = "https://<new-domain>"
ALLOWED_ORIGINS = "http://localhost:5000,...,https://<new-domain>"
```

Get the current domain with: `echo $REPLIT_DEV_DOMAIN`

## Problem 3 — BETTER_AUTH_SECRET missing in worker bindings
CF Workers vars are **not** system env vars. `c.env.BETTER_AUTH_SECRET` is undefined unless provided via wrangler.toml vars or a `.dev.vars` file.

## Fix
Create `apps/api/.dev.vars` (git-ignored):
```
BETTER_AUTH_SECRET=<value from $BETTER_AUTH_SECRET>
```
Wrangler dev automatically reads this file and prints "Using vars defined in .dev.vars" on startup.

**Why:** Wrangler dev uses `.dev.vars` as the local equivalent of Cloudflare secrets — they are injected into `c.env` but not committed to git.

**How to apply:** Whenever setting up wrangler dev on a new Replit machine or after a domain rotation.
