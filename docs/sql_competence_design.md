# SQL Competence Family — Design Document

## Overview

**Family ID:** `sql-competence`
**Family Slug:** `sql-competence`
**URL Base:** `/ai-coding/sql-competence/`
**Status:** Draft — pending review

This document defines the content structure for the SQL Competence family. It mirrors the Claude Code Competence family pattern: five levels of proficiency measured across seven cross-cutting dimensions, driven entirely by JSON data files and rendered by the existing template system.

---

## The Five Levels

Each level represents a recognizable, observable mode of working with SQL. Movement between levels reflects a shift in how all seven dimensions are engaged together — not isolated skill acquisition.

### Level 1 — Query Writer

**Slug:** `query-writer`
**Summary:** Reads data from a single table using basic SELECT, WHERE, and ORDER BY. Treats SQL as a lookup tool.

The Query Writer can retrieve data from a database using a GUI or command-line client. They write single-table queries, apply simple filters, and sort results. They do not yet join multiple tables confidently, have no concern for performance, and typically do not write any DML beyond guided examples.

**Observable behaviors:**
- Opens a SQL client, types `SELECT * FROM table`, scans the results visually.
- Adds WHERE clauses by trial and error rather than intentional filter design.
- Does not think about NULLs, duplicates, or row counts.
- Cannot yet explain why a query returns zero rows.

**Graduation criteria (to Level 2):**
- Writes correct multi-table INNER JOINs without assistance.
- Uses GROUP BY with at least one aggregate function accurately.
- Can explain the difference between WHERE and HAVING.
- Writes basic INSERT, UPDATE, and DELETE statements safely.

---

### Level 2 — Data Analyst

**Slug:** `data-analyst`
**Summary:** Constructs multi-table JOINs, aggregations, subqueries, and basic window functions for structured data analysis.

The Data Analyst uses SQL as a primary analysis tool. They can answer non-trivial business questions from a relational database, write queries other people can read, and handle common data quality concerns (NULLs, duplicates, type coercion). They begin to use CTEs for organization and can write basic window functions like `ROW_NUMBER` and running totals.

**Observable behaviors:**
- Structures queries with CTEs instead of deeply nested subqueries.
- Chooses between LEFT and INNER JOIN deliberately.
- Checks row counts before and after joins to detect fan-out.
- Formats SQL consistently for readability and review.

**Graduation criteria (to Level 3):**
- Designs a simple normalized schema (3NF) for a new feature from requirements.
- Writes and reasons about transactions with explicit COMMIT/ROLLBACK.
- Reads a basic query execution plan and identifies a missing index.
- Writes a stored procedure or function in at least one SQL dialect.

---

### Level 3 — Schema Designer

**Slug:** `schema-designer`
**Summary:** Designs normalized relational schemas, manages data integrity through constraints and transactions, and reads execution plans.

The Schema Designer owns the structural layer of a database. They design tables from requirements rather than retrofitting queries onto ad-hoc schemas. They enforce integrity via constraints (NOT NULL, UNIQUE, FK, CHECK), understand the write implications of indexing, and can diagnose common performance problems at the plan level. They write stored procedures, views, and migrations.

**Observable behaviors:**
- Normalizes to 3NF by default; deviates intentionally with documented reasoning.
- Writes migration scripts that are reversible (up/down).
- Adds foreign key constraints and understands their locking implications.
- Reads a `EXPLAIN` / `EXPLAIN ANALYZE` output and identifies seq scans vs. index scans.

**Graduation criteria (to Level 4):**
- Designs and validates an index strategy for a given query workload.
- Demonstrates understanding of all four isolation levels with concrete failure scenarios.
- Diagnoses and fixes a slow query using execution plan analysis.
- Writes a partitioned table definition with appropriate partition key reasoning.

---

### Level 4 — Performance Engineer

**Slug:** `performance-engineer`
**Summary:** Designs index strategies, interprets execution plans, optimizes slow queries, and manages concurrency and isolation.

The Performance Engineer treats the database as a system to be tuned, not just queried. They understand statistics, cardinality, join algorithms, and when the optimizer makes suboptimal choices. They design composite indexes deliberately, understand covering indexes, recognize implicit type-cast index suppression, and manage concurrency through isolation level selection and lock minimization.

**Observable behaviors:**
- Reviews auto-generated indexes critically; removes unused ones.
- Rewrites correlated subqueries as joins when the plan shows nested loops at scale.
- Uses query hints or plan guides only as a last resort with documented justification.
- Understands MVCC / WAL mechanics and their impact on vacuum, bloat, and replication lag.

**Graduation criteria (to Level 5):**
- Designs a multi-tenant or partitioned database architecture with horizontal scaling reasoning.
- Defines an HA/DR strategy including RPO/RTO targets and replication configuration.
- Authors SQL standards and review guidelines for a development team.
- Evaluates trade-offs between SQL and NoSQL for a given workload and documents the decision.

---

### Level 5 — Database Architect

**Slug:** `database-architect`
**Summary:** Designs enterprise data architectures, establishes governance and standards, and aligns data strategy across teams and systems.

The Database Architect operates at the organizational level. They design for scale, resilience, and team autonomy simultaneously. They define data contracts between services, govern naming conventions and schema review processes, lead adoption of migration tooling, and make buy-vs-build decisions for data infrastructure. They understand distributed SQL, eventual consistency trade-offs, and when relational databases are the wrong choice.

**Observable behaviors:**
- Establishes schema review processes with clear approval gates.
- Designs data models that are stable under changing access patterns.
- Treats backward compatibility of schema changes as a first-class constraint.
- Leads cross-team alignment on shared reference data and canonical identifiers.

---

## The Seven Dimensions

Each dimension is independent. A practitioner can be strong in Query Construction but weak in Collaboration & Standards. The matrix page will show how each dimension manifests at each level.

---

### Dimension 1 — Query Construction

**Slug:** `query-construction`
**Short name:** Querying

The ability to write correct, readable, and efficient SQL that accurately expresses data retrieval and manipulation intent. Encompasses SELECT structure, JOIN logic, filtering, DML, and the progression from single-table lookups to complex multi-step queries.

**Why it matters:** Query Construction is the foundational skill. All other dimensions build on the ability to express intent precisely in SQL. Poor query construction leads to wrong results, performance problems, and unmaintainable code regardless of schema quality.

**Assessment questions:**
- Do you use CTEs rather than deeply nested subqueries to improve readability?
- Can you write a query that produces the correct result when NULLs are present in join columns?
- Do you choose the JOIN type (INNER, LEFT, CROSS) deliberately based on the data relationship?

---

### Dimension 2 — Data Modeling

**Slug:** `data-modeling`
**Short name:** Modeling

Skill in designing relational schemas: normalization, entity relationships, constraints, and structural integrity. Ranges from single-table design to enterprise-wide canonical data models.

**Why it matters:** Schema design decisions are expensive to reverse. A poorly modeled schema constrains every query, migration, and integration built on top of it for years. Data Modeling determines how much query complexity is structural vs. incidental.

**Assessment questions:**
- Can you identify and resolve a second normal form violation in an existing schema?
- Do you add foreign key constraints as a default practice, not an afterthought?
- Can you explain when denormalization is the right choice and what trade-offs it introduces?

---

### Dimension 3 — Analytical Techniques

**Slug:** `analytical-techniques`
**Short name:** Analytics

Proficiency with aggregation patterns, window functions, CTEs, pivoting, and advanced data analysis constructs. Ranges from basic GROUP BY to sophisticated time-series, cohort, and statistical queries.

**Why it matters:** Business intelligence and data analysis are primary SQL use cases. Analytical Techniques determines the range of questions a practitioner can answer directly in SQL without resorting to post-processing in application code or a separate analytics layer.

**Assessment questions:**
- Can you write a rolling 7-day average using a window function?
- Can you compute a customer retention cohort table in SQL?
- Do you know when to use `FILTER (WHERE ...)` vs. a CASE expression inside an aggregate?

---

### Dimension 4 — Performance & Optimization

**Slug:** `performance-optimization`
**Short name:** Performance

Understanding of index design, execution plan analysis, query tuning, and database statistics. Ranges from unaware of performance concerns to expert-level diagnosis and tuning.

**Why it matters:** Queries that work correctly at 1,000 rows may fail at 10,000,000. Performance & Optimization is what separates practitioners who can work effectively on production systems from those who can only work on development datasets.

**Assessment questions:**
- Can you read an execution plan and identify why a query is performing a sequential scan?
- Do you understand how cardinality estimates affect join order selection?
- Can you design a composite index that covers a specific query's filter and sort requirements?

---

### Dimension 5 — Data Integrity & Transactions

**Slug:** `data-integrity`
**Short name:** Integrity

Command of constraints, ACID properties, isolation levels, and transactional design. Ranges from basic NOT NULL usage to robust multi-system transactional patterns and concurrency management.

**Why it matters:** A database that produces fast but inconsistent results is worse than a slow one. Data Integrity & Transactions is what determines whether a system can be trusted in production under concurrent load.

**Assessment questions:**
- Can you explain the difference between READ COMMITTED and REPEATABLE READ isolation levels with a concrete failure scenario for each?
- Do you understand the locking implications of adding a foreign key constraint on a large table?
- Can you identify a situation in which an optimistic locking strategy is preferable to a pessimistic one?

---

### Dimension 6 — Tooling & Workflow

**Slug:** `tooling-workflow`
**Short name:** Workflow

Use of SQL clients, schema migration tools, version control for database changes, automated testing, and CI/CD integration for database deployments. Ranges from ad-hoc query execution to fully automated database lifecycle management.

**Why it matters:** SQL written and run outside of a version-controlled, reviewable workflow is a liability. Tooling & Workflow is what makes database changes auditable, reversible, and safe to deploy at team scale.

**Assessment questions:**
- Do all schema changes go through a migration tool (e.g., Flyway, Liquibase, Alembic, golang-migrate)?
- Are your migrations tested in CI before they reach production?
- Do you use a SQL linter or formatter as part of your review process?

---

### Dimension 7 — Collaboration & Standards

**Slug:** `collaboration-standards`
**Short name:** Standards

Adherence to naming conventions, schema documentation, peer review of database changes, and cross-team data contracts. Ranges from solo scripts to organization-wide data governance.

**Why it matters:** Schemas outlive the teams that build them. Without consistent standards and review practices, database complexity compounds silently until it becomes a systemic constraint on the organization's ability to move.

**Assessment questions:**
- Do you follow a consistent naming convention (snake_case vs. camelCase, singular vs. plural table names) and apply it to every object?
- Do schema changes go through peer review before being applied to production?
- Can you describe what a data contract is and when you would use one between services?

---

## Competency Matrix (Summary)

The full matrix is defined in `matrix.json`. Below is a high-level summary of how each dimension progresses across levels.

| Dimension | L1 Writer | L2 Analyst | L3 Designer | L4 Engineer | L5 Architect |
|---|---|---|---|---|---|
| Query Construction | Single-table SELECT | JOINs, aggregations, CTEs | Complex analytical queries, DML | Optimal query patterns, rewrite for plans | Defines query standards and anti-patterns |
| Data Modeling | No schema design | Understands existing schemas | Designs normalized schemas | Partitioned, optimized schemas | Enterprise canonical models |
| Analytical Techniques | Basic filters | GROUP BY, simple window functions | Advanced window functions, pivoting | Performance-aware analytics | Defines analytical patterns org-wide |
| Performance & Optimization | Unaware | Surface-level index awareness | Reads execution plans, basic tuning | Deep index strategy, concurrency tuning | Capacity planning, architectural trade-offs |
| Data Integrity & Transactions | Basic NOT NULL | Basic constraints, simple transactions | All constraint types, isolation levels | Lock management, concurrency patterns | Distributed consistency, governance |
| Tooling & Workflow | Ad-hoc GUI client | Structured scripts, basic migrations | Migration tooling, version control | CI/CD integration, automated testing | Toolchain standards, release governance |
| Collaboration & Standards | No standards | Follows team conventions | Contributes to conventions | Establishes review processes | Owns org-wide data governance |

---

## JSON File Inventory

The following files will be created under `src/data/families/sql-competence/`:

| File | Contents |
|---|---|
| `family.json` | Family metadata (id, slug, title, status, paths) |
| `overview.json` | Hero text, framework intro, dimensions/levels intro |
| `dimensions.json` | All seven dimension objects with definitions, whyItMatters, assessmentQuestions |
| `levels.json` | All five level objects with coreConcepts, coreSkills, observableBehaviors, failureModes, graduationCriteria, evaluationTasks |
| `matrix.json` | All 35 cells (7 dimensions × 5 levels) with descriptor text |
| `sources.json` | Source groups and individual sources with URLs |
| `glossary.json` | SQL-specific terms used in the framework |
| `roadmap.json` | Learning path stages keyed to levels |
| `author-notes.json` | Author perspective and synthesis |
| `quiz-questions.json` | Practice quiz questions (scenario, knowledge, behavioral types) |
| `example-projects.json` | Hands-on projects mapped to levels |
| `exercises.json` | Dimension-specific exercises |
| `certifications.json` | SQL/database certifications (placeholder, mirrors existing pattern) |

---

## URL Structure

```
/ai-coding/sql-competence/                          — family landing
/ai-coding/sql-competence/overview/                 — framework narrative
/ai-coding/sql-competence/dimensions/               — evaluation dimensions
/ai-coding/sql-competence/matrix/                   — competency matrix
/ai-coding/sql-competence/levels/query-writer/      — Level 1
/ai-coding/sql-competence/levels/data-analyst/      — Level 2
/ai-coding/sql-competence/levels/schema-designer/   — Level 3
/ai-coding/sql-competence/levels/performance-engineer/ — Level 4
/ai-coding/sql-competence/levels/database-architect/ — Level 5
/ai-coding/sql-competence/sources/                  — source inventory
/ai-coding/sql-competence/author-perspective/        — author synthesis
/ai-coding/sql-competence/glossary/                 — terms
/ai-coding/sql-competence/roadmap/                  — learning paths
/ai-coding/sql-competence/assess/                   — self-assessment
/ai-coding/sql-competence/quiz/                     — practice quiz
/ai-coding/sql-competence/projects/                 — example projects
/ai-coding/sql-competence/study-guide/              — study guide
```

---

## Open Questions for Review

1. **Level names** — "Query Writer" through "Database Architect" — are these titles clear and recognizable to your target audience?
2. **Dimension count** — Seven dimensions are proposed. Should any be merged (e.g., Analytical Techniques into Query Construction) or split (e.g., separating DDL from DML within Data Modeling)?
3. **Certifications page** — Should SQL Competence include a certifications page? Candidates would be Oracle Database, Microsoft DP-300, PostgreSQL Professional, etc. Or leave it as a placeholder?
4. **Dialect scope** — The framework is designed to be dialect-agnostic (PostgreSQL, MySQL, SQL Server, BigQuery). Should any dimension explicitly call out dialect awareness, or keep it generic?
5. **Status** — Should this family launch as `"draft"` (visible but flagged) or `"coming-soon"` (card shown on home page but pages not yet generated)?
