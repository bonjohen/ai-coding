# Reviewing Diffs Line by Line

## Why This Matters

Claude Code generates diffs — additions, deletions, and modifications to your code. Accepting a diff without reading it is like merging a pull request without review. It might work, but you're accumulating risk.

## What to Look For in Every Diff

### 1. Unintended Deletions
Claude Code sometimes removes code it considers unnecessary. Check that nothing important was deleted.

```diff
  function processOrder(order: Order) {
-   validateOrder(order);  // Was this removed intentionally?
    const total = calculateTotal(order.items);
    return submitOrder(order, total);
  }
```

Ask: "Was that validation call supposed to be removed, or did Claude think it was redundant?"

### 2. Hardcoded Values
Watch for magic numbers, hardcoded URLs, or credentials that should come from configuration.

```diff
+ const API_URL = "https://api.example.com/v2";  // Should this be in .env?
```

### 3. Missing Error Handling
Claude Code often writes the happy path. Check that error cases are handled.

```diff
+ const data = await fetch(url);
+ const json = await data.json();  // What if fetch fails? What if JSON is invalid?
```

### 4. Style Inconsistencies
Does the generated code match your project's conventions? Naming, indentation, import style?

## The Review Checklist

For every diff Claude Code produces:

- [ ] Read every added line — do you understand what it does?
- [ ] Read every deleted line — should it have been deleted?
- [ ] Check for hardcoded values that should be configurable
- [ ] Check for missing error handling
- [ ] Verify naming matches project conventions
- [ ] Run tests before accepting

## Practice

After your next Claude Code interaction, spend 60 seconds on each of these checkpoints before accepting. Track how many times you catch something.
