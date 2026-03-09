# Roadmap

## In Progress

## Planned

- [ ] **`Subscriber<T>` type export**
- [ ] **`equalityFn` for `useStore`**
- [ ] **Batch updates API** — Add `store.batch(fn)` that defers subscriber notifications until `fn` completes. All `set`/`update` calls inside `fn` should queue but only flush once at the end.

## Done

- [x] Enhance `subscribe` to pass `(state, prevState)` to callbacks
- [x] Extract `Selector<T, U>` to `types.ts` and re-export from barrel
- [x] Add runtime test for subscriber `(state, prevState)` params
- [x] **`ComputedStore` class** — reactive derived store with `SourceStore<T>` interface, `connect()`/`disconnect()` lifecycle, chaining support
- [x] **`SourceStore<T>` interface** — shared contract (`get()` + `subscribe()`) for `Store` and `ComputedStore`
- [x] Extract `Subscriber<T>`, `UpdateOptions` to `types.ts`
- [x] `Store<T> implements SourceStore<T>`
