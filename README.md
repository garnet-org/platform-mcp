# Garnet Platform MCP

MCP (Model Context Protocol) client for connecting Claude Desktop to the Garnet security platform.

## Installation

You can use this client directly with `npx` (no installation required):

```bash
npx @garnet-org/platform-mcp
```

Or install globally:

```bash
npm install -g @garnet-org/platform-mcp
```

## Configuration

### 1. Get your API token

Using garnetctl:
```bash
garnetctl config current-token
```

Or create a new token:
```bash
garnetctl token create --name "mcp-integration"
```

### 2. Configure Claude Desktop

Edit your Claude configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "garnet": {
      "command": "npx",
      "args": ["@garnet-org/platform-mcp"],
      "env": {
        "GARNET_API_URL": "https://api.garnet.ai/api/v1/mcp",
        "GARNET_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "garnet": {
      "command": "garnet-mcp",
      "env": {
        "GARNET_API_URL": "https://api.garnet.ai/api/v1/mcp",
        "GARNET_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

### 4. Verify the connection

In Claude, you should see Garnet tools available. Try asking:
- "List recent security events"
- "Show me security issues"
- "List network policies"

## Environment Variables

- `GARNET_API_URL`: The Garnet API endpoint (default: `http://localhost:8080/api/v1/mcp`)
- `GARNET_API_TOKEN`: Your project authentication token (required)

## Available Tools

The MCP client provides access to these Garnet security tools:

- **garnetListEvents** - List recent security events with filtering options
- **garnetGetEvent** - Get detailed information about a specific event
- **garnetBlockEvent** - Block network destination associated with an event
- **garnetListAgents** - List security agents in the project
- **garnetListIssues** - List security issues with filtering options
- **garnetGetIssue** - Get detailed information about a specific issue
- **garnetBlockIssue** - Block network destination associated with an issue
- **garnetListNetworkPolicies** - List network policies for the project

## Self-Hosted Instances

If you're running a self-hosted Garnet instance, update the `GARNET_API_URL` to point to your server:

```json
"env": {
  "GARNET_API_URL": "https://your-garnet-instance.com/api/v1/mcp",
  "GARNET_API_TOKEN": "your-token-here"
}
```

## Development

This client acts as a bridge between Claude's MCP protocol (stdio) and the Garnet HTTP API. It forwards JSON-RPC requests from Claude to the Garnet server and returns the responses.

## Support

For issues and questions:
- GitHub Issues: https://github.com/garnet-org/garnet-platform-mcp/issues
- Documentation: https://docs.garnet.ai

## License

MIT