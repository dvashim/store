---
"@dvashim/store": minor
---

Enhance `store.subscribe` to pass `(state, prevState)` to subscriber callbacks

- **Core:** `subscribe` callbacks now receive `(state: T, prevState: T)` instead of no arguments, enabling subscribers to react based on state diffs without calling `store.get()`
- **Types:** Extract `Selector<T, U>` type into a shared `types.ts` module and re-export it from the package barrel
