# SQL Competence — Phased Release Plan

## Status Key
- [ ] Not started
- [x] Complete

---

## Phase 1: Foundation — All Required Files & First Build
Create all 10 required JSON files with full content. Add navigation entries.
Get `npm run build` to pass with the new family generating all core pages.

**Files created (10 required JSON, all with real content):**
- `src/data/families/sql-competence/family.json` — family metadata
- `src/data/families/sql-competence/overview.json` — hero, intro, level summaries
- `src/data/families/sql-competence/dimensions.json` — 7 dimensions, full definitions
- `src/data/families/sql-competence/levels.json` — 5 levels, full coreConcepts/coreSkills/behaviors/criteria
- `src/data/families/sql-competence/matrix.json` — 35 cells (7 dims x 5 levels)
- `src/data/families/sql-competence/sources.json` — 8 sources across 3 groups
- `src/data/families/sql-competence/glossary.json` — 21 SQL terms
- `src/data/families/sql-competence/roadmap.json` — 5 learning stages
- `src/data/families/sql-competence/author-notes.json` — 3 perspective sections
- `src/data/families/sql-competence/exercises.json` — 10 exercises (2 per level)

**Files modified:**
- `src/data/site/navigation.json` — added sql-competence familyNav (Overview, Levels, Reference, Study Guide)
- `build/build-site.ts` — added design docs to keepFiles

**Result:** Build passes, 14 SQL Competence pages generated (47 total).

- [x] Phase 1

---

## Phase 2: Quiz & Assessment
Create quiz-questions.json with self-rate questions (3 per dimension = 21) plus
scenario/knowledge questions (5-10 per level = 25-50). Enables assess/ and quiz/ pages.
Update navigation to include Assess and Quiz links.

**Acceptance:** Self-Assessment page renders with radar chart. Quiz page works with filtering.

- [ ] Phase 2

---

## Phase 3: Example Projects
Create example-projects.json with 2 projects per level (10 total).
Enables projects gallery and individual project detail pages.
Update navigation to include Projects link.

**Acceptance:** Projects gallery and all project detail pages render.

- [ ] Phase 3

---

## Phase 4: Home Page, CSS & Polish
Add SQL Competence card to home page Content Families section.
Create `src/styles/families/sql-competence.css` accent color override.
Full build, visual review of all pages, fix any rendering issues.
Start local dev server.

**Acceptance:** Full site builds cleanly. SQL family navigable end-to-end.
Local dev server running for review.

- [ ] Phase 4
