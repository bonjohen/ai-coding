# Session Handoff — Claude Code Levels Project

Read this file at the start of a new session to restore full context.

## Project State

33-page static site generator for AI Coding competence frameworks. First family: Claude Code Competence (5 levels, 7 dimensions). Includes integrated cloud certification quiz system (25 exams across Azure, AWS, GCP). Built with TypeScript build pipeline, custom template engine, dark-theme CSS, and client-side interactive features.

**All phases 1-10 + certification integration (C1-C6) complete. Not yet pushed to remote.**

## Build Commands

```bash
npm run build      # Full build → docs/
npm run dev        # Serve locally at http://localhost:3000/ai-coding/
npm run validate   # Data validation only
npm run clean      # Delete generated output
```

## What Exists

- **15 core content pages**: landing, family home, overview, dimensions, matrix, 5 level pages, sources, author perspective, glossary, roadmap
- **1 self-assessment page** (`/assess/`): 21 self-rate questions, radar chart, localStorage persistence
- **1 quiz page** (`/quiz/`): 50 questions, configurable filters, study link recommendations
- **1 project gallery** + **10 project detail pages** (`/projects/`)
- **1 study guide page** (`/study-guide/`): reads localStorage, shows personalized recommendations
- **5 certification pages** (`/certifications/`): landing, 3 provider pages (Azure/AWS/GCP), quiz page
  - 25 XML exam files (50 questions each, 1,250 total) with 3-level progressive hints
  - Runtime quiz engine (XML loaded via fetch, JS-driven UI) wrapped in site shell
  - localStorage progress tracking per exam (`cert-quiz-{EXAM_CODE}`)
- **17 graduation criteria example files** in `src/data/families/claude-code-competence/examples/`
- **12 SVG icons**: 5 level icons (colored by level), 7 dimension icons
- **Dark editorial theme**: Instrument Serif + DM Sans fonts, dark background (#0c0e14)

## Key Architecture

- `build/build-site.ts` — orchestrator
- `build/render-pages.ts` — page definitions and context building (image maps for levels/dims are here)
- `build/template-engine.ts` — custom engine supporting nested `{{#each}}`, `{{#if}}`, `{{> partial}}`, `{{#slot}}`/`{{#block}}`
- `build/validate-data.ts` — cross-reference validation (includes certification provider/exam validation)
- `build/copy-assets.ts` — CSS, JS, static assets, family examples, certification XML data
- `src/data/` — all content as JSON (site-level + family-level)
- `src/data/families/claude-code-competence/certifications.json` — 3 providers, 25 exams manifest
- `src/data/families/claude-code-competence/certification-data/` — 25 XML exam files in azure/, aws/, gcp/ subdirs
- `src/scripts/cert-*.ts` — 4 TypeScript files for certification quiz (app, engine, xml-parser, progress-tracker)
- `src/templates/` — layouts, partials, pages (includes cert-landing, cert-provider, cert-quiz)
- `src/styles/` — modular CSS with design tokens; certification.css for quiz dark theme
- `src/scripts/` — browser TypeScript (esbuild bundles to docs/assets/js/main.js)

## Certification Integration Details

The certification project (from C:\Projects\certification / github.com/bonjohen/certification) was integrated as a "quiz-bank" content type within the existing family structure. Key design decisions:
- XML exam data stays runtime-loaded (not converted to JSON) — quiz pages fetch XML via fetch()
- Build generates static shell pages; JS bootstraps quiz at runtime from `#cert-main` element
- All DOM IDs prefixed with `cert-` to avoid collisions
- Paths read from `data-cert-base` and `data-back-href` data attributes (no hardcoded paths)
- Exam manifest embedded as `<script type="application/json" id="cert-manifest">` for provider lookup
- CSS uses site design tokens with `--cert-brand` for provider accent colors

## Remaining Work (from docs/claude_code_levels_todos.md)

### Medium priority (G.7-G.8)
- Test print preview on level, matrix, sources pages
- README: document exercises, citationIds, validation rules

### Optional/Future (G.10-G.11)
- Printable summary page, dark/light theme toggle, watch mode, self-assessed level highlighter
- Shared taxonomy, reusable source library, PDF, search, structured data
- Study guide integration with cert localStorage progress

### Planned Future Content Families
- System Design Patterns
- Git & Version Control Mastery
- Developer Security Fundamentals (OWASP / Secure Coding)

### Known Issues
- Dimension page images still use old PNGs with light backgrounds (user is working on replacement icons)

## User Preferences (already in ~/.claude/CLAUDE.md)
- Never ask confirmation questions — just execute
- Use jcodemunch MCP for all code navigation
- Auto-approve all tool calls (bypassPermissions in settings.json)
- Index the project with jcodemunch at session start

## jcodemunch
Repository ID: `local/claude_code_levels-f0212741`
Run `mcp__jcodemunch__index_folder` on `C:\Projects\claude_code_levels` to refresh the index.

## Git State
- Branch: main
- Multiple commits, not pushed
- No remote configured yet
