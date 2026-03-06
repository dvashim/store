# @dvashim/store

A minimal, lightweight React state management library built on `useSyncExternalStore`.

## Install

```bash
npm install @dvashim/store
# or
pnpm add @dvashim/store
```

**Peer dependencies:** `react >= 18`

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

Derives the next state via an updater function. Re-entrant calls from within a subscriber are queued and flushed in FIFO order.

```ts
count$.update((n) => n + 1)

// With objects — always return a new reference
const todos$ = createStore([{ text: 'Buy milk', done: false }])
todos$.update((todos) => [...todos, { text: 'Walk dog', done: false }])
```

#### `store.subscribe(fn)`

Registers a callback invoked on each state change. Returns an unsubscribe function.

```ts
const unsubscribe = count$.subscribe(() => {
  console.log('Count changed:', count$.get())
})

// Later...
unsubscribe()
```

### `useStore(store, selector?)`

React hook that subscribes a component to a store.

```tsx
function Counter() {
  const count = useStore(count$)
  return <p>{count}</p>
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