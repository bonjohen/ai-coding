# Using Hooks or Pre-Commit Checks

## What Hooks Do

Claude Code hooks are shell commands that run automatically in response to events. They enforce standards without you remembering to check manually.

## Example: Settings Configuration with Hooks

In `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "echo 'Reminder: run tests after this edit'"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx eslint --quiet ${filepath} 2>/dev/null || true"
      }
    ]
  }
}
```

This runs ESLint on every file Claude Code edits, catching style violations immediately.

## Example: Pre-Commit Hook

In `.husky/pre-commit` (using Husky):

```bash
#!/bin/sh
npx lint-staged
npx tsc --noEmit
```

With `lint-staged` config in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

This ensures every commit — whether from you or Claude Code — passes linting and type-checking.

## What to Enforce with Hooks

| Check | Why |
|---|---|
| Linting | Consistent style without manual review |
| Type checking | Catch type errors before commit |
| Test runner | Ensure tests pass before changes land |
| File size limits | Prevent accidentally committed large files |
| Secret scanning | Block credentials from entering the repo |

## The Key Insight

Hooks shift quality enforcement from "remember to check" to "automatically enforced." This is especially valuable with AI-generated code, where the volume of changes can exceed what you'd manually review for style issues.
