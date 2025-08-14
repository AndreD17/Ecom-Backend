## GitHub Copilot Chat

- Extension Version: 0.28.5 (prod)
- VS Code: vscode/1.101.2
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.5 (10 ms)
- DNS ipv6 Lookup: Error (64 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (137 ms)
- Electron fetch (configured): HTTP 200 (608 ms)
- Node.js https: HTTP 200 (510 ms)
- Node.js fetch: HTTP 200 (560 ms)
- Helix fetch: HTTP 200 (734 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.21 (45 ms)
- DNS ipv6 Lookup: Error (52 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (36 ms)
- Electron fetch (configured): HTTP 200 (712 ms)
- Node.js https: HTTP 200 (801 ms)
- Node.js fetch: HTTP 200 (780 ms)
- Helix fetch: HTTP 200 (925 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).