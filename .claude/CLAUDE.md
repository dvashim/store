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

Tests use **Vitest** with **jsdom** environment and **@testing-library/react**. Test files go in `tests/` as `*.test.ts` / `*.test.tsx`. Type tests use `*.test-d.ts` with `expectTypeOf`. Use `@/*` alias to import from `src/` (e.g. `import { Store } from '@/Store'`). Run a single test file with `pnpm test tests/foo.test.ts`.

## Architecture

The library source lives in `src/` (~300 lines across 6 files). The central abstraction is the `SourceStore<T>` interface (defined in `types.ts`): anything with `get()` and `subscribe()` methods. Both `Store` and `ComputedStore` implement it, which enables chaining.

- **`Store.ts`** — Core mutable state container. Uses ES2022 private fields. Exposes `get()`, `set()`, `update()`, `subscribe()`. Re-entrant updates (calling `set`/`update` from within a subscriber) are queued and flushed in FIFO order with a safety limit (100 iterations). Uses `Object.is` for equality checks; pass `{ force: true }` to bypass.
- **`ComputedStore.ts`** — Read-only derived store using composition. Wraps a `SourceStore<T>` + `Selector<T, U>`, creates an internal `Store<U>` that auto-updates when the source changes. Implements `SourceStore<U>` so computed stores can be chained as sources for other computed stores. Has `connect()`/`disconnect()` to control the source subscription. Provides `protected` accessors (`source`, `selector`) for subclassing.
- **`useStore.ts`** — React hook wrapping `useSyncExternalStore`. Supports an optional selector for derived state. Selector stored in a `useRef` to avoid resubscribing when inline selectors change reference.
- **`createStore.ts`** — Factory function with TypeScript overloads to create `Store` instances.
- **`types.ts`** — Shared type definitions: `Selector<T, U>`, `Subscriber<T>`, `UpdateOptions`, `SourceStore<T>`.
- **`index.ts`** — Public barrel. Re-exports everything except `SourceStore` and `UpdateOptions` (internal-only).

## Tooling

- **Biome** for linting and formatting (extends `@dvashim/biome-config/react-balanced`)
- **TypeScript** uses project references: `tsconfig.dev.json` (library source), `tsconfig.node.json` (vitest config). Tests have their own `tests/tsconfig.json` (extends `tsconfig.dev.json`, noEmit).
- **pnpm** as package manager
- **Changesets** for versioning and npm publishing

## Release

Push to `main` triggers the GitHub Actions workflow: runs `pnpm ci` (check + test), builds, then uses changesets to create version PRs or publish to npm.
