---
"@dvashim/store": patch
---

Update project tooling for Node.js 24

- **CI:** Bump target Node.js version from 22 to 24
- **CI:** Upgrade `pnpm/action-setup` from v4 to v5 for Node 24 runtime compatibility
- **CI:** Replace `pnpm run ci` script with explicit `pnpm check` and `pnpm test` steps in workflows
- **Package:** Remove `ci` script from package.json
- **Package:** Sort package.json fields according to conventional order
