# @dvashim/matzav

## 1.2.1

### Patch Changes

- [#16](https://github.com/dvashim/store/pull/16) [`2832f40`](https://github.com/dvashim/store/commit/2832f4023f1f704476f714c574a6d3b52a871d43) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Improve documentation and project tooling

  - **Docs:** Improve README installation section with separate npm and pnpm code blocks
  - **Docs:** Fix CHANGELOG indentation for proper markdown rendering
  - **Tooling:** Move CLAUDE.md to `.claude/` directory
  - **Tooling:** Add changeset slash command for Claude Code

## 1.2.0

### Minor Changes

- [#14](https://github.com/dvashim/store/pull/14) [`f4dc9e6`](https://github.com/dvashim/store/commit/f4dc9e6d03021ca89ae062af7b2e3d8b5a52b306) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)!

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

## 1.1.3

### Patch Changes

- [#11](https://github.com/dvashim/store/pull/11) [`e04b13f`](https://github.com/dvashim/store/commit/e04b13f04e06563c0f1e53f4602b94fc869d4c86) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - expose getter method to read current state

## 1.1.2

### Patch Changes

- [#8](https://github.com/dvashim/store/pull/8) [`b5e4374`](https://github.com/dvashim/store/commit/b5e437406ffcbe6d9236bb29bc5ba5efd5d840f6) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Minor improvements

## 1.1.1

### Patch Changes

- [#6](https://github.com/dvashim/store/pull/6) [`132569c`](https://github.com/dvashim/store/commit/132569c1314dec9e18e771fa2b51c86b48ffe04f) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Minor improvements

## 1.1.0

### Minor Changes

- [#4](https://github.com/dvashim/store/pull/4) [`f327cf8`](https://github.com/dvashim/store/commit/f327cf828c37a4b34ec86bac08c6c26e64bc0606) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Refactoring

## 1.0.1

### Patch Changes

- [#2](https://github.com/dvashim/store/pull/2) [`b74a9eb`](https://github.com/dvashim/store/commit/b74a9ebf574e5d7579e2710b9f5b658804b05f8e) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Initialize repo
