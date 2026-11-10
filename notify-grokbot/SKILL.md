---
name: notify-grokbot
description: Report a task outcome to the user's Grok Bot assistant. Use when a meaningful task is done, you are blocked, or you need the user's decision.
argument-hint: <done|blocked|question|info> "<summary>" [link...]
---

Report a task **outcome** to the user's Grok Bot assistant, so they hear about it away from the session.

## Send

When the task reaches an outcome, run once, from this skill's folder:

```sh
scripts/notify-grokbot <status> "<one or two sentence summary>" [PR or URL ...]
```

| Status     | Outcome                                    |
| ---------- | ------------------------------------------ |
| `done`     | A meaningful task is finished.             |
| `blocked`  | You cannot go on without outside help.     |
| `question` | You need a decision from the user.         |
| `info`     | Anything else worth an interruption.       |

The script already adds `from`, `project` and `branch`: spend the summary on what happened and what the user must decide. Extra arguments become `links`.

Done when each outcome has exactly one message. A new outcome (blocked, later done) earns a new message; progress earns none.

## Content

The message leaves the session and lands in a chat. Keep it public-safe: summaries and links only, with secrets, tokens, credentials and customer data left out.

## Not configured

The script always exits 0. A `notify-grokbot:` warning on stderr means nothing was sent: tell the user once to run `scripts/setup-webhook` from this skill's folder in their own terminal, then carry on with the task. The wizard is interactive: it has them create the Grok Bot routine from [reference/grokbot-routine.md](reference/grokbot-routine.md), stores the webhook in `~/.config/grokbot/webhook.env`, and sends a test. That file holds the user's secrets, so the wizard is its only writer.

`GROKBOT_WEBHOOK_URL` and `GROKBOT_WEBHOOK_AUTH`, when both are set in the environment, override the file (CI, containers). Exports in shell rc files often miss agents started outside a terminal, so the wizard's file is the supported setup.
