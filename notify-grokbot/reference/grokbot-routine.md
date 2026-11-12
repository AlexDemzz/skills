# Grok Bot routine

The receiving end of `scripts/notify-grokbot`: a Grok Bot routine with a webhook trigger. `scripts/setup-webhook` copies the prompt below to the clipboard; paste it into your Grok Bot chat and the Bot creates the routine.

## Prompt

```text
Set up a routine named "Messages from Claude Code", triggered when a webhook fires (add a webhook trigger), with this instruction:

A message was POSTed to this webhook by Claude Code, my coding agent. The JSON payload has: from (always claude-code), project, branch, status (done, blocked, question or info), message, and links (an array of URLs). Read it: who sent it, which project and branch, and what it says.

Relay it to me in this chat, in my usual language, short and plain: what happened and anything I need to decide. Keep any links, PR URLs or thread ids the payload includes.

If the payload is empty, malformed, or clearly a test ping, tell me in one line that a test message arrived.

Result goes to me in this chat.
```

## Payload

```json
{
  "from": "claude-code",
  "project": "my-repo",
  "branch": "main",
  "status": "done",
  "message": "One or two sentence summary.",
  "links": ["https://github.com/owner/repo/pull/1"]
}
```

Sent as `POST` with `Content-Type: application/json` and the routine's `Authorization: Bearer <key>` header.
