# Creating and Maintaining CLAUDE.md Files

## What Goes in CLAUDE.md

A good CLAUDE.md tells Claude Code everything it needs to work effectively in your project without you repeating it every session.

## Example CLAUDE.md for a TypeScript API Project

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Build Commands

- `npm run dev` — Start development server on port 3000
- `npm run build` — Production build to dist/
- `npm run test` — Run Jest test suite
- `npm run test:watch` — Run tests in watch mode
- `npm run lint` — Run ESLint
- `npm run typecheck` — Run TypeScript compiler check

## Architecture

This is an Express API with Prisma ORM and PostgreSQL.

- `src/routes/` — Express route handlers, one file per resource
- `src/middleware/` — Express middleware (auth, validation, error handling)
- `src/services/` — Business logic, one service per domain concept
- `src/models/` — Prisma client and generated types
- `tests/` — Jest tests mirroring src/ structure

## Conventions

- Use named exports, not default exports
- All route handlers must use the asyncHandler wrapper from src/middleware/async.ts
- Validation uses Zod schemas defined alongside route handlers
- Error responses use the AppError class from src/middleware/errors.ts
- Database queries go in service files, never in route handlers

## Testing

- Unit tests for services, integration tests for routes
- Use the test database configured in .env.test
- Run `npm run db:test:reset` before running integration tests
- Test files follow the pattern: `tests/{path}/{name}.test.ts`
```

## What NOT to Put in CLAUDE.md

- Obvious things ("use TypeScript", "write clean code")
- Information that changes frequently (current sprint tasks)
- Secrets or credentials
- Entire API documentation (link to it instead)

## Maintaining It

Update CLAUDE.md when:
- Build commands change
- New conventions are adopted
- Architecture evolves (new directories, new patterns)
- You find yourself repeating the same context to Claude Code

A stale CLAUDE.md is worse than none — it actively misleads.
