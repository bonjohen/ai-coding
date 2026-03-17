# Designing Organizational AI Coding Strategy and Governance

## Template: AI Coding Policy Document

### 1. Scope and Purpose

This policy defines how AI coding tools (Claude Code, Copilot, etc.) are used within the engineering organization. It establishes standards for quality, security, and accountability.

**Applies to:** All engineers using AI coding tools in company repositories.

### 2. Approved Tools and Models

| Tool | Approved Models | Use Cases |
|---|---|---|
| Claude Code | Opus, Sonnet | Code generation, review, refactoring |
| Claude Code (headless) | Sonnet, Haiku | CI/CD automation, batch operations |

### 3. Usage Tiers

**Tier 1 — Interactive (all engineers):**
- Single-session Claude Code usage
- Code generation, debugging, refactoring
- Requires manual review before commit

**Tier 2 — Automated (requires team lead approval):**
- Headless mode in scripts
- CI/CD pipeline integration
- Requires automated test gates

**Tier 3 — Autonomous (requires VP Engineering approval):**
- Multi-agent workflows
- Automated PR creation
- Requires audit logging and human review before merge

### 4. Review Requirements

- All AI-generated code must be reviewed by a human before merging
- PR descriptions must indicate which sections were AI-generated
- Security-sensitive code (auth, crypto, payments) requires senior review regardless of origin

### 5. Audit Trail

- All CI/CD Claude Code invocations are logged with: timestamp, model, prompt hash, token count, cost
- Logs retained for 90 days minimum
- Monthly report generated for engineering leadership

### 6. Cost Controls

- Per-engineer monthly budget: $200 (Tier 1)
- Per-pipeline monthly budget: $500 (Tier 2)
- Autonomous workflow budget requires explicit approval per project

### 7. Prohibited Uses

- Generating code that handles credentials without security review
- Using AI tools on repositories containing classified or restricted data
- Automated merging without human approval
- Sharing proprietary code context with unapproved AI services

### 8. Incident Response

If AI-generated code causes a production incident:
1. Tag the incident as AI-related in the incident tracker
2. Include the originating prompt/session in the post-mortem
3. Review whether the failure mode should trigger a new policy rule
