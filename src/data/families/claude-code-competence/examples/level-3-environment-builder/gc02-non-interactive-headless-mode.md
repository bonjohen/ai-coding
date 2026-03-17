# Using Non-Interactive or Headless Mode

## What Headless Mode Is

Claude Code can run without a terminal UI using the `--print` (`-p`) flag. This sends a single prompt, gets a response, and exits — perfect for scripting and automation.

## Basic Usage

```bash
# Single prompt, output to stdout
claude -p "Explain what src/index.ts does" > explanation.txt

# With a specific model
claude -p --model sonnet "Write unit tests for src/utils/format.ts"
```

## Example: Batch Code Review Script

```bash
#!/bin/bash
# review-changed-files.sh
# Reviews all files changed in the current branch vs main

changed_files=$(git diff --name-only main...HEAD -- '*.ts' '*.tsx')

for file in $changed_files; do
  echo "Reviewing: $file"
  claude -p "Review this file for bugs, security issues, and style problems. Be concise. File: $file" \
    > "reviews/$(basename $file .ts).review.md" 2>/dev/null
  echo "  -> reviews/$(basename $file .ts).review.md"
done

echo "Done. Reviews written to reviews/"
```

## Example: Generate Documentation from Code

```bash
#!/bin/bash
# generate-api-docs.sh

claude -p "Read all route files in src/routes/ and generate an API reference
in markdown format. For each endpoint, include: method, path, request body
schema, response schema, and authentication requirements." > docs/api-reference.md
```

## Example: Piped Input

```bash
# Pipe a file for analysis
cat src/config/database.ts | claude -p "Review this database configuration for security issues"

# Pipe git diff for review
git diff --staged | claude -p "Review this diff for bugs and suggest improvements"
```

## When to Use Headless Mode

- **Scripted operations** that should run the same way every time
- **Batch processing** across multiple files
- **CI/CD integration** where there's no terminal
- **Scheduled tasks** (cron jobs for code maintenance)

## Limitations

- No multi-turn conversation — one prompt, one response
- Cannot use interactive tools (file editing requires `--allowedTools`)
- Context is limited to what you provide in the prompt and stdin
