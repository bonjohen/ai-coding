# Mentoring Others on AI Coding Best Practices

## Onboarding Guide Template

### Week 1 — Level 1: Getting Started

**Goal:** New team member can use Claude Code for basic tasks.

**Activities:**
1. Install Claude Code and complete the guided setup
2. Complete 3 simple tasks (bug fix, utility function, test addition)
3. Practice reviewing diffs — annotate what each change does
4. Read the project's CLAUDE.md and explain what each section means

**Checkpoint:** Team member can explain what Claude Code did after each interaction.

### Week 2 — Level 2: Structured Collaboration

**Goal:** Team member uses context, decomposition, and verification consistently.

**Activities:**
1. Implement a feature across 3+ files using decomposed prompts
2. Write a prompt that includes file paths, conventions, and constraints
3. Run the test suite after every Claude Code interaction
4. Practice: take a failed prompt and improve it with better context

**Checkpoint:** Team member's prompts reference specific files and include constraints. They run tests before accepting.

### Week 3 — Level 3: Environment Awareness

**Goal:** Team member understands and contributes to project AI tooling.

**Activities:**
1. Review the project's CLAUDE.md and suggest an improvement
2. Configure a personal `.claude/settings.json` with appropriate permissions
3. Use an MCP server (if configured) for a real task
4. Add a useful convention to the project's CLAUDE.md based on a pattern they discovered

**Checkpoint:** Team member has made a CLAUDE.md contribution and can explain the project's hook configuration.

## Mentoring Principles

1. **Show, don't tell** — pair on a Claude Code session so they see your workflow
2. **Review their prompts** — prompt quality is the #1 skill to develop
3. **Let them fail safely** — have them work on non-critical tasks first
4. **Celebrate the catches** — when they find a bug in AI output during review, that's a win
5. **Share your failures** — times you accepted bad AI output teach more than success stories
