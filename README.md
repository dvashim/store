# @dvashim/store

[![CI][ci-badge]][ci-url]
[![npm version][npm-badge]][npm-url]
[![npm downloads][downloads-badge]][npm-url]
[![License: MIT][license-badge]][license-url]
[![TypeScript][ts-badge]][ts-url]
[![Checked with Biome][biome-badge]][biome-url]

[ci-badge]: https://img.shields.io/github/actions/workflow/status/dvashim/store/ci.yml?branch=main&style=flat-square&logo=github&label=CI
[ci-url]: https://github.com/dvashim/store/actions/workflows/ci.yml
[npm-badge]: https://img.shields.io/npm/v/@dvashim/store.svg?logo=npm&style=flat-square&color=07c&label=@dvashim/store
[npm-url]: https://www.npmjs.com/package/@dvashim/store
[downloads-badge]: https://img.shields.io/npm/dm/@dvashim/store?logo=npm&style=flat-square&color=07c
[license-badge]: https://img.shields.io/npm/l/@dvashim/store?style=flat-square&color=07c
[license-url]: https://github.com/dvashim/store/blob/main/LICENSE
[ts-badge]: https://img.shields.io/badge/TypeScript-07c?style=flat-square&logo=typescript&logoColor=fff
[ts-url]: https://www.typescriptlang.org/
[biome-badge]: https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat-square&logo=biome&color=07c&logoColor=fff
[biome-url]: https://biomejs.dev

A minimal, lightweight React state management library built on `useSyncExternalStore`.

## Install

npm:

```bash
npm install @dvashim/store
```

or pnpm:

```bash
pnpm add @dvashim/store
```

**Peer dependencies:** `react` and `react-dom` ^18.0.0 || ^19.0.0

## Quick Start

```tsx
import { createStore, useStore } from '@dvashim/store'

const count$ = createStore(0)

function Counter() {
  const count = useStore(count$)

  return (
    <button onClick={() => count$.update((n) => n + 1)}>
      Count: {count}
    </button>
  )
}
```

## API

### `createStore(initialState?)`

Creates a new `Store` instance.

```ts
const count$ = createStore(0)
const user$ = createStore({ name: 'Alice', age: 30 })

// Without initial state — type defaults to T | undefined
const data$ = createStore<string>()
```

### `Store`

Reactive state container with subscription-based change notification.

#### `store.get()`

Returns the current state.

```ts
const count$ = createStore(10)
count$.get() // 10
```

#### `store.set(state, options?)`

Replaces the state. Skipped if the value is identical (`Object.is`), unless `{ force: true }` is passed.

```ts
count$.set(5)

// Force notify subscribers even if the value hasn't changed
count$.set(5, { force: true })
```

#### `store.update(updater, options?)`

Derives the next state via an updater function. Calling `set()` or `update()` from within a subscriber throws an error.

```ts
count$.update((n) => n + 1)

// With objects — always return a new reference
const todos$ = createStore([{ text: 'Buy milk', done: false }])
todos$.update((todos) => [...todos, { text: 'Walk dog', done: false }])
```

#### `store.subscribe(fn)`

Registers a callback invoked on each state change with the new and previous state. Returns an unsubscribe function.

```ts
const unsubscribe = count$.subscribe((state, prevState) => {
  console.log(`Count changed from ${prevState} to ${state}`)
})

// Later...
unsubscribe()
```

### `ComputedStore`

A read-only reactive store that derives its value from a source store using a selector. Automatically updates when the source changes. Accepts any `SourceStore<T>` (including `Store` or another `ComputedStore`) as its source.

```ts
import { createStore, ComputedStore } from '@dvashim/store'


const todos$ = createStore([
  { text: 'Buy milk', done: true },
  { text: 'Walk dog', done: false },
])

const remaining$ = new ComputedStore(todos$, (todos) =>
  todos.filter((t) => !t.done).length
)

remaining$.get() // 1
remaining$.subscribe((count, prev) => console.log(`${prev} → ${count}`))
```

#### Chaining

`ComputedStore` implements `SourceStore<U>`, so it can be used as the source for another `ComputedStore`.

```ts
const count$ = new ComputedStore(todos$, (todos) => todos.length)
const label$ = new ComputedStore(count$, (n) => `${n} items`)
label$.get() // "2 items"
```

#### `computed.connect()` / `computed.disconnect()`

Control the subscription to the source store. After `disconnect()`, the derived value stops updating and `get()` returns the last known value. Call `connect()` to resume — it immediately syncs the derived value with the current source state before resubscribing.

```ts
remaining$.disconnect()
remaining$.isConnected // false

remaining$.connect()
remaining$.isConnected // true
```

### `useStore(store, selector?)`

React hook that subscribes a component to any `SourceStore` — works with both `Store` and `ComputedStore`.

```tsx
function Counter() {
  const count = useStore(count$)
  return <p>{count}</p>
}

function Remaining() {
  const remaining = useStore(remaining$)
  return <p>{remaining} left</p>
}
```

#### With a selector

Derive a value from the store state. The selector should return a referentially stable value (primitive or existing object reference) to avoid unnecessary re-renders.

```tsx
const user$ = createStore({ name: 'Alice', age: 30 })

function UserName() {
  const name = useStore(user$, (user) => user.name)
  return <p>{name}</p>
}
```

### Types

The following types are exported from the package:

```ts
import type { Selector, Subscriber } from '@dvashim/store'
```

| Type | Definition |
| ---- | ---------- |
| `Selector<T, U>` | `(state: T) => U` |
| `Subscriber<T>` | `(state: T, prevState: T) => void` |

## Patterns

### Shared stores across components

Define stores outside of components and import them where needed.

```ts
// stores/auth.ts
import { createStore } from '@dvashim/store'

export const token$ = createStore<string | null>(null)

export function login(token: string) {
  token$.set(token)
}

export function logout() {
  token$.set(null)
}
```

```tsx
// components/Profile.tsx
import { useStore } from '@dvashim/store'
import { token$, logout } from '../stores/auth'

function Profile() {
  const token = useStore(token$)

  if (!token) return <p>Not logged in</p>

  return <button onClick={logout}>Log out</button>
}
```

### Combining multiple stores

```tsx
import { createStore, useStore } from '@dvashim/store'

const firstName$ = createStore('Alice')
const lastName$ = createStore('Smith')

function FullName() {
  const firstName = useStore(firstName$)
  const lastName = useStore(lastName$)

  return <p>{firstName} {lastName}</p>
}
```

### Using the Store class directly

```ts
import { Store } from '@dvashim/store'

class TimerService {
  readonly seconds$ = new Store(0)
  #interval: ReturnType<typeof setInterval> | undefined

  start() {
    this.#interval = setInterval(() => {
      this.seconds$.update((s) => s + 1)
    }, 1000)
  }

  stop() {
    clearInterval(this.#interval)
  }
}
```

## License

MIT
