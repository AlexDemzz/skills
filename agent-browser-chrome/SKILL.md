---
name: agent-browser-chrome
description: Bridge to /agent-browser that forces use of the user's local Chrome via CDP (port 9222). Use this whenever the user says "agent-browser-chrome", "use my chrome", "use my browser", "attach to my chrome", invokes /agent-browser-chrome, or wants browser automation to run inside their already-open Chrome session (preserving cookies, logins, open tabs). Prefer this over /agent-browser anytime the user expects to see the result in their own Chrome window or needs existing authentication.
---

# agent-browser-chrome

Thin bridge over `/agent-browser`. Attaches `agent-browser` to the user's running Chrome via CDP, then behaves identically to `/agent-browser`.

## Prerequisite

User's Chrome must have remote debugging enabled at `127.0.0.1:9222`
(Chrome → Settings → "Allow remote debugging for this browser instance").

## Step 1 — attach (always run first)

```bash
agent-browser connect 9222
```

If this fails: tell the user to enable "Allow remote debugging" in Chrome settings (or launch Chrome with `--remote-debugging-port=9222`). Do not fall back to a fresh headless browser — that defeats the purpose of this skill.

## Step 2 — use agent-browser normally

After the connect succeeds, every subsequent `agent-browser <cmd>` call runs inside the user's Chrome. Follow the full `/agent-browser` skill (snapshot, click, fill, screenshot, etc.). All commands, refs, and patterns are identical.

## Why this exists

Running automation in the user's own Chrome means cookies, logged-in sessions, extensions, and open tabs are reused — no re-auth, no separate window, and the user sees everything happen live. The only difference from `/agent-browser` is the one-time `connect 9222` at the start.
