---
"@dvashim/store": minor
---

### Refactored core implementation

- Reorganized `Store` class methods and improved state management with object-based `QueueItem` type
- Enhanced `useStore` hook with improved selector handling and memoization
- Adjusted `createStore` function signatures for clarity and consistency

### Added comprehensive test suite

- Added unit tests for `Store`, `createStore`, and `useStore`
- Added type inference tests (`test-d.ts`) for `Store`, `createStore`, and `useStore`

### Added CI and tooling

- Added CI workflow for pull requests and updated release workflow
- Added `.node-version` file for consistent Node.js version
- Updated Biome configuration with enhanced linter rules
- Consolidated TypeScript configuration with project references (`tsconfig.dev.json`, `tsconfig.node.json`, `tests/tsconfig.json`)
- Added Vitest configuration

### Added documentation

- Added README with installation instructions, API documentation, and usage examples
- Added CLAUDE.md with project conventions

### Other fixes

- Updated dependencies for compatibility
- Added `react` and `react-dom` as peer dependencies
- Changed package access level to public
