## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.96.2
- OS: Mac

## Network

User Settings:

```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:

- DNS ipv4 Lookup: 140.82.121.6 (6 ms)
- DNS ipv6 Lookup: ::ffff:140.82.121.6 (1 ms)
- Electron Fetcher (configured): HTTP 200 (139 ms)
- Node Fetcher: HTTP 200 (134 ms)
- Helix Fetcher: HTTP 200 (342 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:

- DNS ipv4 Lookup: 140.82.113.22 (44 ms)
- DNS ipv6 Lookup: ::ffff:140.82.113.22 (1 ms)
- Electron Fetcher (configured): HTTP 200 (403 ms)
- Node Fetcher: HTTP 200 (392 ms)
- Helix Fetcher: HTTP 200 (414 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
