# @dvashim/store

## 1.3.0

### Minor Changes

- [#28](https://github.com/dvashim/store/pull/28) [`1546a84`](https://github.com/dvashim/store/commit/1546a84b2ac332db0e94f3cc7d23aceee3cb9680) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Enhance `store.subscribe` to pass `(state, prevState)` to subscriber callbacks

  - **Core:** `subscribe` callbacks now receive `(state: T, prevState: T)` instead of no arguments, enabling subscribers to react based on state diffs without calling `store.get()`
  - **Types:** Extract `Selector<T, U>` type into a shared `types.ts` module and re-export it from the package barrel

## 1.2.5

### Patch Changes

- [#25](https://github.com/dvashim/store/pull/25) [`e7bb95c`](https://github.com/dvashim/store/commit/e7bb95ccb63c21cffd351145ddac2e1ae49252d6) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Update TypeScript config and consolidate CI workflows

  - **Deps:** Update @dvashim/typescript-config to 1.1.11
  - **CI:** Add `ci` script combining check and test, use it in CI and release workflows
  - **Docs:** Update CLAUDE.md to reflect new CI script

## 1.2.4

### Patch Changes

- [#23](https://github.com/dvashim/store/pull/23) [`e481e9e`](https://github.com/dvashim/store/commit/e481e9e6e2ba3f20ab125b2ff0972d2804c445a3) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Prevent infinite loops in subscriber updates and improve error handling during state flush

  - **Fix:** Add a safety limit of 100 re-entrant updates to prevent infinite loops in subscribers
  - **Fix:** Catch updater errors individually so remaining queued items still process; rethrow the first error after the queue drains
  - **Docs:** Update README to document re-entrant update safety limit and error handling behavior

## 1.2.3

### Patch Changes

- [#21](https://github.com/dvashim/store/pull/21) [`91d5d05`](https://github.com/dvashim/store/commit/91d5d05052f6fac806b0540dc27d226bcd4e94dd) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Simplify release workflow by removing unnecessary `registry-url` and using `NPM_TOKEN` directly for npm authentication

## 1.2.2

### Patch Changes

- [#19](https://github.com/dvashim/store/pull/19) [`7550cb2`](https://github.com/dvashim/store/commit/7550cb290640e69fbdaa1d302e285c45ac31c0aa) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Remove changeset command documentation in favor of local skill configuration

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
