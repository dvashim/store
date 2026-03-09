# Roadmap

## In Progress

## Planned

- [ ] **`equalityFn` for `useStore`**
- [ ] **`useStore` support for `SourceStore<T>`** — Widen the `useStore` hook signature to accept `SourceStore<T>` instead of only `Store<T>`, enabling direct use with `ComputedStore` and any future `SourceStore` implementations.
- [ ] **Batch updates API** — Add `store.batch(fn)` that defers subscriber notifications until `fn` completes. All `set`/`update` calls inside `fn` should queue but only flush once at the end.
- [ ] **Lazy subscription for `ComputedStore`** — Add a `{ lazy: true }` constructor option that defers source subscription until the first `subscribe()` or `get()` call, instead of auto-connecting eagerly in the constructor. This avoids unnecessary computation and subscription overhead for computed stores that may not be immediately consumed.
- [ ] **Cascading `disconnect()` for chained `ComputedStore`** — When calling `disconnect()` on a `ComputedStore` whose source is also a `ComputedStore`, propagate disconnection up the chain so the entire derived graph is torn down in a single call.
- [ ] **`useValue` hook for `ComputedStore`** — A React hook that subscribes to a `ComputedStore` (or chain of computed stores) via `useSyncExternalStore`, automatically managing `connect()`/`disconnect()` lifecycle tied to component mount/unmount. Returns the current derived value with full type inference.
- [ ] **Writable `ComputedStore`** — Support an optional reverse setter that maps the derived value back to the source, enabling two-way binding through the computed layer. Accepts a `{ get, set }` descriptor instead of a plain selector, e.g. `new ComputedStore(source, { get: (s) => s.celsius * 9/5 + 32, set: (f, source) => source.set({ celsius: (f - 32) * 5/9 }) })`. Should propagate writes through chained computed stores when each link provides a setter.
- [ ] **`Store` configuration object constructor** — Accept a configuration argument in the `Store` constructor that supports declarative computed properties, e.g. `new Store({ defaultState: [1, 2], computed: { len: (s) => s.length } })`, enabling co-located derived state without manually creating separate `ComputedStore` instances.

## Done

- [x] Enhance `subscribe` to pass `(state, prevState)` to callbacks
- [x] Extract `Selector<T, U>` to `types.ts` and re-export from barrel
- [x] Add runtime test for subscriber `(state, prevState)` params
- [x] **`ComputedStore` class** — reactive derived store with `SourceStore<T>` interface, `connect()`/`disconnect()` lifecycle, chaining support
- [x] **`SourceStore<T>` interface** — shared contract (`get()` + `subscribe()`) for `Store` and `ComputedStore`
- [x] Extract `Subscriber<T>`, `UpdateOptions` to `types.ts`
- [x] `Store<T> implements SourceStore<T>`
- [x] **`Subscriber<T>` type export** — exported from `types.ts` and re-exported via barrel
