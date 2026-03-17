# Explaining What Claude Code Did and Why

## The Test

After any Claude Code interaction, you should be able to answer:

1. **What did Claude Code change?** (which files, which functions)
2. **Why did it make those changes?** (what problem was it solving)
3. **How does the change work?** (the logic, not just "it added a function")

If you can't answer all three, you don't understand the change well enough to accept it.

## Example Walkthrough

### The prompt:
```
Add rate limiting to the /api/users endpoint. Limit to 100 requests per minute per IP.
```

### Claude Code's response:
It created a middleware file `src/middleware/rateLimit.ts` and modified `src/routes/users.ts`.

### Your explanation should be:

> "Claude Code created an in-memory rate limiter using a Map keyed by IP address.
> Each entry stores a count and a timestamp. On each request, it checks if the
> current window (60 seconds) has expired — if so, it resets. If the count exceeds
> 100, it returns a 429 status. The middleware is applied to the users router
> before any route handlers."

### Follow-up questions to ask yourself:

- What happens when the server restarts? (The Map resets — rate limits are lost)
- What happens with multiple server instances? (Each has its own Map — limits aren't shared)
- Is there a memory leak? (Old entries aren't cleaned up unless the same IP makes a new request)

These are the kinds of issues you catch when you truly understand the change.

## Practice

After your next Claude Code session, write a 2-3 sentence summary of what changed and why. If you struggle, ask Claude Code: "Explain what you just did and why you chose this approach."
