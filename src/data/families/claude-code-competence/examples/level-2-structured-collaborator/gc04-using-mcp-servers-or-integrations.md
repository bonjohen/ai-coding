# Using MCP Servers or External Tool Integrations

## What MCP Servers Do

Model Context Protocol (MCP) servers give Claude Code access to external tools and data sources — databases, APIs, file systems, documentation — through a standardized interface.

## Example: Adding a PostgreSQL MCP Server

In `.claude/settings.json`:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

Now Claude Code can query your database directly:

```
> What tables exist in the database? Show me the schema for the users table.
```

Claude Code will use the MCP server to run the query and return real results.

## Example: Adding a Filesystem MCP Server for Docs

```json
{
  "mcpServers": {
    "docs": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/docs"]
    }
  }
}
```

This gives Claude Code read access to documentation outside the project directory.

## Common MCP Server Use Cases

| Server | Use Case |
|---|---|
| Postgres/MySQL | Query database schema and data for context |
| Filesystem | Access docs, configs, or related projects |
| GitHub | Read issues, PRs, and repo metadata |
| Fetch/HTTP | Access API documentation or external resources |

## Security Considerations

- MCP servers run with the permissions of your user account
- Use read-only database credentials where possible
- Scope filesystem access to specific directories
- Review what data the server exposes before configuring it

## When to Use MCP vs. Pasting Context

Use MCP when:
- The data changes frequently (database schema, API responses)
- The data is too large to paste (full documentation sets)
- You need real-time information (current database state)

Paste context when:
- The information is small and static
- You only need it for one session
- Security concerns prevent MCP access
