# Evaluating and Adopting New AI Coding Tools

## Evaluation Rubric

Score each criterion 1-5. A tool needs a total score of 28+ (out of 45) to proceed to a pilot.

| # | Criterion | Weight | Score | Notes |
|---|---|---|---|---|
| 1 | **Code Quality** — Does the tool produce correct, idiomatic code for our stack? | 3x | _/5 | Test with 5 representative tasks from your codebase |
| 2 | **Security** — Can we control what the tool accesses? Are there permission boundaries? | 3x | _/5 | Review the permission model and data handling policy |
| 3 | **Integration** — Does it fit our workflow (IDE, CLI, CI/CD)? | 2x | _/5 | Test in your actual development environment |
| 4 | **Cost** — What is the per-engineer monthly cost at expected usage? | 2x | _/5 | Estimate based on current AI tool usage patterns |
| 5 | **Auditability** — Can we log what the tool does? Is there an audit trail? | 2x | _/5 | Required for Tier 2+ usage |
| 6 | **Context Handling** — How much project context can it use? How well? | 1x | _/5 | Test with large files, multi-file tasks |
| 7 | **Team Fit** — Will the team actually adopt it? Learning curve? | 1x | _/5 | Survey 3-5 engineers after a 1-hour trial |
| 8 | **Vendor Stability** — Is the vendor reliable? Roadmap alignment? | 1x | _/5 | Review company stage, funding, and product direction |
| 9 | **Data Privacy** — Does it meet our data handling requirements? | 1x | _/5 | Legal/compliance review |

**Weighted total:** ___ / 45

## Evaluation Process

### Phase 1: Quick Assessment (1 day)
- Read documentation and security policies
- Run 5 representative tasks from your codebase
- Score criteria 1, 3, 6

### Phase 2: Deep Evaluation (1 week)
- 3-5 engineers use the tool for real work
- Track quality issues, time saved, frustrations
- Score remaining criteria

### Phase 3: Pilot (2-4 weeks)
- One team adopts for non-critical work
- Measure: tasks completed, bugs introduced, time saved, cost
- Decision: adopt, extend pilot, or reject

## Decision Template

```
Tool: [name]
Evaluated by: [names]
Date: [date]
Score: [X]/45

Recommendation: [ADOPT / EXTEND PILOT / REJECT]

Key strengths:
- ...

Key risks:
- ...

Conditions for adoption:
- ...
```
