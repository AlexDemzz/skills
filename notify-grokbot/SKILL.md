---
name: notify-grokbot
description: Send a short message to Alexandre's Grok Bot assistant. Use when you finish a meaningful task, get blocked, or need a decision from Alexandre.
argument-hint: <done|blocked|question|info> "<summary>" [link...]
---

Tell Alexandre's Grok Bot assistant how a task ended, so he hears about it without watching the session.

## Send

Run the script that ships with this skill, from this skill's folder:

```sh
scripts/notify-grokbot <status> "<one or two sentence summary>" [PR or URL ...]
```

| Status     | When                                            |
| ---------- | ----------------------------------------------- |
| `done`     | A meaningful task is finished.                  |
| `blocked`  | You cannot go on without outside help.          |
| `question` | You need a decision from Alexandre.             |
| `info`     | Anything else worth knowing, used sparingly.    |

The script adds where it ran from: `from` (`claude-code`, or `t3code` inside a T3 Code thread), `project` (git toplevel or current folder name) and `branch`. Pass PR or deploy URLs as extra arguments; they become `links`.

## Rules

- One message per task outcome. No progress updates, no follow-up to say the same thing again.
- Never put secrets, tokens, credentials or private customer data in the message or the links.
- The script always exits 0 and never fails your task. A warning on stderr means nothing was sent; mention it to Alexandre once and carry on.

## Config

The webhook lives in `~/.config/grokbot/webhook.env` (mode 600), filled by Alexandre from the Grok Bot routine panel:

```sh
GROKBOT_WEBHOOK_URL="..."
GROKBOT_WEBHOOK_AUTH="..."
```

Never read, print, edit or commit its values. While it is missing or still holds the `PASTE_` placeholders, the script warns and sends nothing.
