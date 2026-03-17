# Integrating Claude Code into CI/CD Pipelines

## Use Case

Run Claude Code as a step in your CI pipeline to automate code review, documentation generation, or test creation on every pull request.

## Example: GitHub Actions — Automated PR Review

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Get changed files
        id: changed
        run: |
          echo "files=$(git diff --name-only origin/main...HEAD -- '*.ts' '*.tsx' | tr '\n' ' ')" >> $GITHUB_OUTPUT

      - name: Run AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review the following changed files for this pull request.
          Focus on: bugs, security issues, performance problems, and missing
          error handling. Format as a markdown checklist.
          Files: ${{ steps.changed.outputs.files }}" > review.md

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## AI Code Review\n\n${review}`
            });
```

## Example: Pre-Merge Documentation Check

```yaml
      - name: Check documentation
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Check if the changed files have corresponding
          documentation updates. List any public functions or APIs that
          were added or modified without doc updates.
          Changed files: ${{ steps.changed.outputs.files }}" > doc-check.md
```

## Security Considerations

- Store API keys as GitHub Secrets, never in workflow files
- Use `--allowedTools` to restrict what Claude Code can do in CI
- Review AI-generated comments before enabling auto-merge
- Set token/cost limits for CI runs to prevent runaway usage

## Cost Management

- Use `--model haiku` for simple checks (cheaper, faster)
- Use `--model sonnet` for detailed code review
- Only run on changed files, not the entire codebase
- Set a `--max-tokens` limit appropriate for the task
