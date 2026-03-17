# Session Handoff — Claude Code Levels Project

Read this file at the start of a new session to restore full context.

## Project State

28-page static site generator for AI Coding competence frameworks. First family: Claude Code Competence (5 levels, 7 dimensions). Built with TypeScript build pipeline, custom template engine, dark-theme CSS, and client-side interactive features.

**All phases 1-10 complete. Not yet pushed to remote.**

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
- **17 graduation criteria example files** in `src/data/families/claude-code-competence/examples/`
- **12 SVG icons**: 5 level icons (colored by level), 7 dimension icons
- **Dark editorial theme**: Instrument Serif + DM Sans fonts, dark background (#0c0e14)

## Key Architecture

- `build/build-site.ts` — orchestrator
- `build/render-pages.ts` — page definitions and context building (image maps for levels/dims are here)
- `build/template-engine.ts` — custom engine supporting nested `{{#each}}`, `{{#if}}`, `{{> partial}}`, `{{#slot}}`/`{{#block}}`
- `build/validate-data.ts` — cross-reference validation
- `src/data/` — all content as JSON (site-level + family-level)
- `src/templates/` — layouts, partials, pages
- `src/styles/` — modular CSS with design tokens
- `src/scripts/` — browser TypeScript (esbuild bundles to docs/assets/js/main.js)

## Remaining Work (from docs/claude_code_levels_todos.md)

### Medium priority (G.7-G.9)
- Test print preview on level, matrix, sources pages
- ~~Test validation failure on deliberately broken input~~ **DONE**
- ~~Verify site via `npm run dev`~~ **DONE**
- README: document exercises, citationIds, validation rules
- ~~Accessibility: skip-to-content link, ARIA landmarks~~ **DONE**

### Optional/Future (G.10-G.11)
- Printable summary page
- Dark/light theme toggle
- Watch mode
- Self-assessed level highlighter
- Shared taxonomy, reusable source library, PDF, search, structured data

### Known Issues
- Dimension page images still use old PNGs with light backgrounds (user is working on replacement icons)
- Level 3-5 icons were recently redesigned (folder, flowchart, brain+shield)
- Level 2 icon is two people with bidirectional arrow

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
