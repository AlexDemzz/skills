---
name: for-sure
description: "Use this skill when the user wants to know the current best practice for a given subject. Triggers on /for-sure <subject>, but also use it when the user asks \"what's the best practice to do X?\",\"what's the best way to do X?\", \"how should I handle X?\", \"what's the recommended approach for X?\", or needs guidance on the right way to do something — even if they don't explicitly say \"best practice.\""
argument-hint: <subject>
user-invocable: true
allowed-tools: WebSearch, WebFetch
---

# For Sure — Best Practice Finder

Find the current, recognized best practice for a given subject — backed by real sources.

## How It Works

1. **Identify the subject**: Use the argument provided (e.g. `/for-sure error handling in TypeScript`). If no argument, look at the current conversation context.

2. **Search for the best practice**: Use WebSearch to find what authoritative sources recommend right now:
   - Official documentation (React docs, MDN, language specs)
   - Reputable engineering blogs (Vercel, Google, Netflix, Airbnb engineering)
   - Conference talks from recognized experts
   - Well-known books or style guides
   - RFCs or design documents

3. **Prefer recent sources**: Best practices change. Prioritize sources from the last 1-2 years over older ones. If the best practice has recently shifted, mention what changed and why.

4. **Respond with a structured answer**:

### Response Format

**Subject**: [the topic]

**Best Practice**: [clear, actionable description of what to do]

**Why**: [1-2 sentences on why this is the recommended approach]

**Sources**:
- [Source 1 title](URL) — brief note
- [Source 2 title](URL) — brief note
- [Source 3 title](URL) — brief note

**Watch out**: [common mistakes or outdated advice people still follow for this topic]