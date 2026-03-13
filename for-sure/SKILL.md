---
name: for-sure
description: Verify if something is actually a best practice by searching the internet for authoritative references. Use when the user types /for-sure or /for-sure <subject>.
argument-hint: <subject>
user-invocable: true
allowed-tools: WebSearch, WebFetch
---

# For Sure — Best Practice Checker

Verify whether a claim, pattern, or technique is actually a recognized best practice — backed by real sources.

## How It Works

1. **Identify the subject**: Use the argument if provided (e.g. `/for-sure memoize all React components`). If no argument, look at the current conversation context — what was just discussed, suggested, or implemented.

2. **Be skeptical**: Do NOT assume it is a best practice. Your job is to verify, not to confirm. Many common beliefs in software engineering are myths, outdated, or context-dependent.

3. **Search for references**: Use WebSearch to find authoritative sources:
   - Official documentation (React docs, MDN, language specs)
   - Reputable engineering blogs (Vercel, Google, Netflix, Airbnb engineering)
   - Conference talks from recognized experts
   - Well-known books or style guides
   - RFCs or design documents

4. **Evaluate the evidence**: Consider whether:
   - The practice is universally accepted or context-dependent
   - It was once a best practice but is now outdated
   - There are notable counter-arguments or trade-offs
   - The sources are authoritative or just popular opinion

5. **Respond with a structured verdict**:

### Response Format

**Subject**: [the practice being evaluated]

**Verdict**: [one of: Confirmed Best Practice / Context-Dependent / Debatable / Outdated / Myth]

**Summary**: [2-3 sentences explaining the verdict]

**Sources**:
- [Source 1 title](URL) — brief note on what it says
- [Source 2 title](URL) — brief note on what it says
- [Source 3 title](URL) — brief note on what it says

**Nuance** (if applicable): [any important caveats, trade-offs, or contexts where the advice changes]
