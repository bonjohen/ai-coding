# Creating Safety Boundaries and Audit Trails for Autonomous Agents

## Safety Boundaries

### Permission Denylist

In `.claude/settings.json`, restrict what automated agents can do:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run test*)",
      "Bash(npm run lint*)",
      "Bash(npx tsc --noEmit)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push *)",
      "Bash(git reset --hard*)",
      "Bash(npm publish*)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  }
}
```

This allows the agent to read, edit, and run tests, but blocks destructive commands, network access, and publishing.

### Restricted File Patterns

Prevent agents from modifying sensitive files:

```json
{
  "permissions": {
    "deny": [
      "Edit(*.env*)",
      "Edit(*credentials*)",
      "Edit(*secret*)",
      "Edit(.github/workflows/*)",
      "Write(*.env*)"
    ]
  }
}
```

## Audit Trail Implementation

### Logging Script Wrapper

```bash
#!/bin/bash
# claude-audited.sh — Wraps Claude Code with audit logging

AUDIT_LOG="logs/claude-audit.jsonl"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(uuidgen)

# Log the invocation
echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"user\":\"$(whoami)\",\"args\":\"$*\"}" >> "$AUDIT_LOG"

# Run Claude Code and capture output
claude "$@" 2>&1 | tee "logs/sessions/${SESSION_ID}.log"
EXIT_CODE=${PIPESTATUS[0]}

# Log completion
echo "{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"session\":\"$SESSION_ID\",\"exit_code\":$EXIT_CODE}" >> "$AUDIT_LOG"

exit $EXIT_CODE
```

### What to Log

| Field | Purpose |
|---|---|
| Timestamp | When the agent ran |
| User | Who initiated the run |
| Session ID | Correlate all actions within one run |
| Prompt/args | What the agent was asked to do |
| Files modified | What changed (via git diff) |
| Exit code | Whether the agent succeeded or failed |
| Token usage | Cost tracking |

### Post-Run Audit Hook

```bash
#!/bin/bash
# post-run-audit.sh — Run after each Claude Code session in CI

git diff --stat HEAD > "logs/sessions/${SESSION_ID}-changes.txt"
git diff HEAD > "logs/sessions/${SESSION_ID}-full-diff.patch"
```

This captures a complete record of what the agent changed, reviewable after the fact.
