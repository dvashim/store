---
"@dvashim/store": minor
---

Add ComputedStore class for reactive derived state

- **ComputedStore:** New read-only reactive store that derives its value from a source store via a selector, with `connect()`/`disconnect()` lifecycle and chaining support
- **SourceStore\<T\> interface:** Shared contract (`get()` + `subscribe()`) implemented by both `Store` and `ComputedStore`, enabling interoperability
- **Types:** Export `Subscriber<T>`, `UpdateOptions`, and `SourceStore<T>` from `types.ts`
- **Store:** `Store<T>` now implements `SourceStore<T>`
