# @dvashim/store

## 1.5.0

### Minor Changes

- [#44](https://github.com/dvashim/store/pull/44) [`b4619ce`](https://github.com/dvashim/store/commit/b4619ce0ffa2a6087529a6660171057f02cf9d34) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Replace re-entrant update queue with immediate throw

  - **Breaking:** Calling `set()` or `update()` from within a subscriber now throws instead of being queued and flushed
  - **Removed:** Queue-based flush system and 100-iteration safety limit

## 1.4.6

### Patch Changes

- [#42](https://github.com/dvashim/store/pull/42) [`6d67358`](https://github.com/dvashim/store/commit/6d67358585c9abba993916de05aea3fdabf838b5) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Fix `useStore` hook to accept `SourceStore<T>` instead of `Store<T>`, allowing `ComputedStore` instances to be passed directly

## 1.4.5

### Patch Changes

- [#40](https://github.com/dvashim/store/pull/40) [`c4bb79f`](https://github.com/dvashim/store/commit/c4bb79f5b52939972fd9cd49c486b52eb4db3a79) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Simplify internal implementation of Store and ComputedStore

  - **Refactor:** Simplify Store flush loop to use index-based iteration and skip subscriber notification when there are no subscribers
  - **Refactor:** Extract `#compute` and `#subscribe` private methods in ComputedStore to reduce duplication
  - **Docs:** Clarify that `connect()` immediately syncs the derived value with the current source state

## 1.4.4

### Patch Changes

- [#38](https://github.com/dvashim/store/pull/38) [`84adbfe`](https://github.com/dvashim/store/commit/84adbfe20350581d0f4141447d4c0d0e5504fc80) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Narrow public type exports to `Selector` and `Subscriber` only, keeping `SourceStore` and `UpdateOptions` as internal types

  - Remove commented-out example code from `ComputedStore`
  - Update README and CLAUDE.md to reflect the changed type exports

## 1.4.3

### Patch Changes

- [#36](https://github.com/dvashim/store/pull/36) [`721860d`](https://github.com/dvashim/store/commit/721860d6c257491e94e1d591409ffa1204260d3f) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Update roadmap with planned features for `useStore`, `ComputedStore`, and `Store` API enhancements

## 1.4.2

### Patch Changes

- [#34](https://github.com/dvashim/store/pull/34) [`83d2656`](https://github.com/dvashim/store/commit/83d2656049d41899a582e92d34783f9beb2ba221) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Update @dvashim/typescript-config to 1.1.12

## 1.4.1

### Patch Changes

- [#32](https://github.com/dvashim/store/pull/32) [`8cbfd11`](https://github.com/dvashim/store/commit/8cbfd11b576668f3f56e977d937103d79fe861ae) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Re-export `ComputedStore` from the package barrel (`index.ts`)

## 1.4.0

### Minor Changes

- [#30](https://github.com/dvashim/store/pull/30) [`20315f8`](https://github.com/dvashim/store/commit/20315f8fe2753e90429f987a8062a6b5e73324a9) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Add ComputedStore class for reactive derived state

  - **ComputedStore:** New read-only reactive store that derives its value from a source store via a selector, with `connect()`/`disconnect()` lifecycle and chaining support
  - **SourceStore\<T\> interface:** Shared contract (`get()` + `subscribe()`) implemented by both `Store` and `ComputedStore`, enabling interoperability
  - **Types:** Export `Subscriber<T>`, `UpdateOptions`, and `SourceStore<T>` from `types.ts`
  - **Store:** `Store<T>` now implements `SourceStore<T>`

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
