# Designing Workflows That Span Multiple Claude Code Sessions

## The Pattern

Complex work doesn't fit in a single session. A multi-session workflow breaks work into phases, with each session building on the artifacts from the previous one.

## Example: Database Migration Workflow

### Session 1 — Analysis

```
> Analyze the current Prisma schema in prisma/schema.prisma. I need to add
> a multi-tenant architecture. Each existing model needs a tenantId field.
> List every model that needs changes and describe the migration strategy.
> Write your analysis to docs/migration-plan.md.
```

**Output:** A written plan in `docs/migration-plan.md` that persists after the session ends.

### Session 2 — Schema Changes

```
> Read docs/migration-plan.md for the migration plan. Implement the Prisma
> schema changes described there. Add tenantId to each model listed. Create
> the migration with `npx prisma migrate dev --name add-tenant-id`.
```

**Output:** Updated schema and a migration file.

### Session 3 — Application Code

```
> The schema migration is done (see prisma/migrations/). Now update every
> service in src/services/ to include tenantId in queries. Use the tenant
> from the request context (req.tenantId, set by middleware in
> src/middleware/tenant.ts). Don't modify the middleware itself.
```

**Output:** Updated service files.

### Session 4 — Verification

```
> Run the full test suite. For any failures related to the tenantId changes,
> update the tests to include tenant context. The test helper in
> tests/helpers/auth.ts has a createTestTenant() function.
```

## Why Multiple Sessions?

| Reason | Benefit |
|---|---|
| Fresh context window | Each session starts clean, no accumulated confusion |
| Review checkpoints | You verify output between sessions |
| Persistent artifacts | Plans, schemas, and code survive session boundaries |
| Smaller diffs | Each session produces a reviewable, bounded set of changes |

## The Key Principle

Each session should produce a **persistent artifact** (a file, a migration, a plan document) that the next session can read. Don't rely on conversation history — rely on what's in the codebase.
