# Orchestrating Multiple Agents on Parallel Tasks

## The Concept

When tasks are independent, running multiple Claude Code instances in parallel cuts wall-clock time significantly. Each agent works in an isolated worktree to prevent conflicts.

## Example: Parallel Module Implementation

You have three independent modules to build: user service, notification service, and analytics service.

```bash
#!/bin/bash
# parallel-build.sh

set -e

# Create worktrees for isolation
git worktree add ../worktree-users -b feature/users
git worktree add ../worktree-notify -b feature/notifications
git worktree add ../worktree-analytics -b feature/analytics

# Launch agents in parallel
claude -p "Implement the user service in src/services/users.ts based on \
  the interface in src/types/users.ts. Include CRUD operations and \
  input validation. Write tests in tests/services/users.test.ts." \
  --workdir ../worktree-users &
PID_USERS=$!

claude -p "Implement the notification service in src/services/notifications.ts \
  based on the interface in src/types/notifications.ts. Support email and \
  webhook channels. Write tests in tests/services/notifications.test.ts." \
  --workdir ../worktree-notify &
PID_NOTIFY=$!

claude -p "Implement the analytics service in src/services/analytics.ts \
  based on the interface in src/types/analytics.ts. Include event tracking \
  and aggregation queries. Write tests in tests/services/analytics.test.ts." \
  --workdir ../worktree-analytics &
PID_ANALYTICS=$!

# Wait for all agents to complete
wait $PID_USERS $PID_NOTIFY $PID_ANALYTICS

echo "All agents complete. Merge branches when ready."
echo "  git merge feature/users"
echo "  git merge feature/notifications"
echo "  git merge feature/analytics"
```

## Prerequisites for Parallel Work

1. **Independent tasks** — agents shouldn't edit the same files
2. **Isolated workspaces** — git worktrees or separate checkouts
3. **Clear interfaces** — each agent needs to know the contract but not the implementation of other modules
4. **Pre-defined types** — create shared interfaces/types before launching agents

## Coordination Pattern

```
1. Human defines interfaces and contracts (shared types)
2. Human creates isolated worktrees
3. Agents implement in parallel (one module each)
4. Human reviews each branch
5. Human merges sequentially, resolving any conflicts
```

## What Not to Parallelize

- Tasks that modify the same files
- Tasks with ordering dependencies (B needs A's output)
- Schema migrations (must be sequential)
- Configuration changes that affect the whole project
