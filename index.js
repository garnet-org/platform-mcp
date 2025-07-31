#!/usr/bin/env node

const http = require('http');
const https = require('https');
const readline = require('readline');

// Configuration
const GARNET_URL = process.env.GARNET_API_URL || 'http://localhost:8080/api/v1/mcp';
const AUTH_TOKEN = process.env.GARNET_API_TOKEN || '';

// Parse URL
const url = new URL(GARNET_URL);
const client = url.protocol === 'https:' ? https : http;

console.error(`[Garnet MCP] Starting... Connecting to ${GARNET_URL}`);

// Create readline interface for line-by-line processing
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Handle each line of input
rl.on('line', async (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    console.error(`[Garnet MCP] <- Request: ${request.method}`);

    // Forward to Garnet platform
    const response = await forwardRequest(request);

    // Send response
    console.error(`[Garnet MCP] -> Response for ${request.method}`);
    console.log(JSON.stringify(response));
  } catch (e) {
    console.error('[Garnet MCP] Error:', e.message);
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: e.message
      },
      id: null
    };
    console.log(JSON.stringify(errorResponse));
  }
});

rl.on('close', () => {
  console.error('[Garnet MCP] Readline closed, exiting');
  process.exit(0);
});

function forwardRequest(request) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(request);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Project-Token': AUTH_TOKEN
      }
    };

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          resolve({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Invalid response from server',
              data: data
            },
            id: request.id
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Failed to connect to server',
          data: e.message
        },
        id: request.id
      });
    });

    req.write(postData);
    req.end();
  });
}

// Don't exit on signals
process.on('SIGINT', () => {
  console.error('[Garnet MCP] SIGINT received, ignoring');
});

process.on('SIGTERM', () => {
  console.error('[Garnet MCP] SIGTERM received, ignoring');
});

// Log startup
console.error('[Garnet MCP] Ready for requests');