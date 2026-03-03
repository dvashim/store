# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

@dvashim/store — a minimal, lightweight React state management library built on `useSyncExternalStore`. Published as an ES module to npm.

## Commands

```bash
pnpm build          # Build with tsc (outputs to dist/)
pnpm check          # Clean + run all checks (biome + typecheck)
pnpm check:biome    # Lint and format check via Biome
pnpm check:ts       # TypeScript type checking (src + test, no emit)
pnpm test           # Run tests once (vitest run)
pnpm test:watch     # Run tests in watch mode (vitest)
pnpm watch          # Build in watch mode
pnpm clean          # Remove dist/ and tsbuildinfo
```

Tests use **Vitest** with **jsdom** environment and **@testing-library/react**. Test files go in `test/` as `*.test.ts` / `*.test.tsx`. Use `@/*` alias to import from `src/` (e.g. `import { Store } from '@/Store'`).

## Architecture

The entire library is four files in `src/`:

- **`Store.ts`** — Core `Store<T>` class using ES2022 private fields (`#state`, `#subscribers`). Exposes `get()`, `set()`, `update()`, `subscribe()`. Uses `Object.is` for equality checks in `#notify()`. Reentrant `set()`/`update()` calls during notification are queued. Subscriber errors are isolated (all subscribers run; first error re-thrown after).
- **`useStore.ts`** — React hook wrapping `useSyncExternalStore`. Supports an optional selector for derived state. Uses `useMemo` for memoized subscription and `useDebugValue` for DevTools.
- **`createStore.ts`** — Factory function with TypeScript overloads to create `Store` instances.
- **`index.ts`** — Re-exports all public API.

## Tooling

- **Biome** for linting and formatting (extends `@dvashim/biome-config/react-balanced`)
- **TypeScript** uses project references: `tsconfig.dev.json` (library source), `tsconfig.node.json` (vitest config), `tsconfig.test.json` (test files)
- **pnpm** as package manager (v10.30.3)
- **Changesets** for versioning and npm publishing

## Release

Push to `main` triggers the GitHub Actions workflow: runs `pnpm check`, builds, then uses changesets to create version PRs or publish to npm.
