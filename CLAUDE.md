# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

@dvashim/store — a minimal, lightweight React state management library built on `useSyncExternalStore`. Published as an ES module to npm.

## Commands

```bash
pnpm build          # Build with tsc (outputs to dist/)
pnpm check          # Run all checks (biome + typecheck)
pnpm check:biome    # Lint and format check via Biome
pnpm check:ts       # TypeScript type checking with declaration emit (catches isolatedDeclarations errors)
pnpm test           # Run tests once (vitest run)
pnpm test:coverage  # Run tests with V8 coverage
pnpm test:watch     # Run tests in watch mode (vitest)
pnpm watch          # Build in watch mode
pnpm clean          # Remove dist/ and tsbuildinfo
pnpm changeset      # Create a new changeset for versioning
```

Tests use **Vitest** with **jsdom** environment and **@testing-library/react**. Test files go in `tests/` as `*.test.ts` / `*.test.tsx`. Type tests use `*.test-d.ts` with `expectTypeOf`. Use `@/*` alias to import from `src/` (e.g. `import { Store } from '@/Store'`). Run a single test file with `pnpm test tests/foo.test.ts`. Biome has custom overrides for test files (disabled complexity checks) and type tests (`useExpect` off).

## Architecture

The library source lives in `src/` (~220 lines across 6 files). The central abstraction is the `SourceStore<T>` interface (defined in `types.ts`): anything with `get()` and `subscribe()` methods. Both `Store` and `ComputedStore` implement it, which enables chaining.

- **`Store.ts`** — Core mutable state container. Uses ES2022 private fields. Exposes `get()`, `set()`, `update()`, `subscribe()`. Re-entrant updates (calling `set`/`update` from within a subscriber) throw immediately. Uses `Object.is` for equality checks; pass `{ force: true }` to bypass.
- **`ComputedStore.ts`** — Read-only derived store using composition. Wraps a `SourceStore<T>` + `Selector<T, U>`, creates an internal `Store<U>` that auto-updates when the source changes. Implements `SourceStore<U>` so computed stores can be chained as sources for other computed stores. Has `connect()`/`disconnect()` to control the source subscription. Provides `protected` accessors (`source`, `selector`) for subclassing.
- **`useStore.ts`** — React hook wrapping `useSyncExternalStore`. Accepts any `SourceStore<T>` (both `Store` and `ComputedStore`). Supports an optional selector for derived state. Selector stored in a `useRef` to avoid resubscribing when inline selectors change reference.
- **`createStore.ts`** — Factory function with TypeScript overloads to create `Store` instances.
- **`types.ts`** — Shared type definitions: `Selector<T, U>`, `Subscriber<T>`, `UpdateOptions`, `SourceStore<T>`.
- **`index.ts`** — Public barrel. Re-exports everything except `SourceStore` and `UpdateOptions` (internal-only). Do not export these types.

## Key Design Decisions

- **Subscriber snapshot iteration** — `Store` copies the subscriber set (`[...this.#subscribers]`) before iterating, allowing safe subscribe/unsubscribe during notification.
- **Re-entrant error identity** — `#reentrantError` is stored as an instance field so the subscriber loop's catch can distinguish re-entrant errors (rethrown) from regular subscriber errors (logged).
- **Selector ref in `useStore`** — The selector is stored in a `useRef` to keep a stable `subscribe` callback for `useSyncExternalStore`, avoiding resubscription when inline selectors change reference.

## Tooling

- **Biome** for linting and formatting (extends `@dvashim/biome-config/react-balanced`)
- **TypeScript** uses project references: `tsconfig.dev.json` (library source), `tsconfig.node.json` (vitest config). Tests have their own `tests/tsconfig.json` (extends `tsconfig.dev.json`, noEmit).
- **`isolatedDeclarations`** is enabled via the parent config (`@dvashim/typescript-config/lib-dev`). All exported methods, accessors, and functions in `src/` must have explicit return type annotations.
- **pnpm** as package manager
- **Changesets** for versioning and npm publishing
- **React** peer dependency supports ^18.0.0 || ^19.0.0
- **TypeScript 6** — uses ES2022 target with `isolatedDeclarations`

## Release

Push to `main` triggers the GitHub Actions workflow: runs `pnpm ci` (check + test), builds, then uses changesets to create version PRs or publish to npm.
