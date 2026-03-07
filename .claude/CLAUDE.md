# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

@dvashim/store — a minimal, lightweight React state management library built on `useSyncExternalStore`. Published as an ES module to npm.

## Commands

```bash
pnpm build          # Build with tsc (outputs to dist/)
pnpm check          # Run all checks (biome + typecheck)
pnpm check:biome    # Lint and format check via Biome
pnpm check:ts       # TypeScript type checking (src + tests, no emit)
pnpm ci             # Run all checks + tests (used in CI workflows)
pnpm test           # Run tests once (vitest run)
pnpm test:watch     # Run tests in watch mode (vitest)
pnpm watch          # Build in watch mode
pnpm clean          # Remove dist/ and tsbuildinfo
```

Tests use **Vitest** with **jsdom** environment and **@testing-library/react**. Test files go in `tests/` as `*.test.ts` / `*.test.tsx`. Use `@/*` alias to import from `src/` (e.g. `import { Store } from '@/Store'`). Run a single test file with `pnpm test tests/foo.test.ts`.

## Architecture

The entire library is four files in `src/`:

- **`Store.ts`** — Core `Store<T>` class using ES2022 private fields (`#state`, `#subscribers`). Exposes `get()`, `set()`, `update()`, `subscribe()`. Uses `Object.is` for equality checks in `#commit()`; pass `{ force: true }` to `set()`/`update()` to bypass. Re-entrant updates (calling `set`/`update` from within a subscriber) are queued in `#queue` and drained in FIFO order by `#flush()`. `#flush()` has a `MAX_FLUSH_ITERATIONS` (100) guard against infinite re-entrant loops. Updater errors are caught per-item (remaining queue items still process); the first error is rethrown after the queue drains. Subscriber errors are caught individually and logged via `console.error`. Spreads subscribers into a snapshot array before iterating to safely handle mutations during notification.
- **`useStore.ts`** — React hook wrapping `useSyncExternalStore`. Supports an optional selector for derived state. Spreads memoized args into `useSyncExternalStore` via `useMemo`. Uses `useDebugValue` for DevTools.
- **`createStore.ts`** — Factory function with TypeScript overloads to create `Store` instances (with initial state, or without for `Store<T | undefined>`).
- **`index.ts`** — Re-exports all public API.

## Tooling

- **Biome** for linting and formatting (extends `@dvashim/biome-config/react-balanced`)
- **TypeScript** uses project references: `tsconfig.dev.json` (library source), `tsconfig.node.json` (vitest config). Tests have their own `tests/tsconfig.json` (extends `tsconfig.dev.json`, noEmit).
- **pnpm** as package manager
- **Changesets** for versioning and npm publishing

## Release

Push to `main` triggers the GitHub Actions workflow: runs `pnpm ci` (check + test), builds, then uses changesets to create version PRs or publish to npm.
