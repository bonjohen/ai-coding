# Configuring Project-Level Context That Persists

## The Problem

Without persistent configuration, every Claude Code session starts from zero. You repeat the same context — build commands, conventions, architecture — every time.

## Layered Context Architecture

```
project-root/
├── CLAUDE.md                  ← Project-wide context (build, conventions)
├── .claude/
│   └── settings.json          ← Permissions, hooks, MCP servers
├── src/
│   ├── CLAUDE.md              ← Source code conventions
│   ├── api/
│   │   └── CLAUDE.md          ← API-specific patterns
│   └── components/
│       └── CLAUDE.md          ← Component conventions
└── tests/
    └── CLAUDE.md              ← Testing conventions
```

Each CLAUDE.md scopes its guidance to the directory it lives in. Claude Code reads all CLAUDE.md files from the root down to the current working directory.

## Example: Root CLAUDE.md

```markdown
# CLAUDE.md

## Commands
- `npm run dev` — development server
- `npm test` — run all tests
- `npm run build` — production build

## Architecture
Express API + React frontend monorepo. API in src/api/, frontend in src/app/.
```

## Example: src/api/CLAUDE.md

```markdown
# API Conventions

- All routes use the controller → service → repository pattern
- Validation with Zod, schemas co-located with controllers
- Every endpoint needs an integration test in tests/api/
- Use the `asyncHandler` wrapper for all async route handlers
```

## Example: .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npx jest *)",
      "Bash(npx eslint *)"
    ]
  }
}
```

This lets Claude Code run build, test, and lint commands without asking for permission each time, while still gating other shell operations.

## When to Add a New CLAUDE.md Layer

Add a directory-level CLAUDE.md when:
- The directory has conventions that differ from the project root
- You find yourself correcting Claude Code's approach in that area repeatedly
- A new team member would need domain-specific guidance for that part of the codebase
