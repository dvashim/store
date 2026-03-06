import { useDebugValue, useMemo, useRef, useSyncExternalStore } from 'react'
import type { Store } from './Store'

type Selector<T, U> = (state: T) => U

/**
 * Subscribes a React component to a {@link Store} and returns its current state.
 *
 * @param store - The store to subscribe to.
 * @returns The current state of the store.
 */
function useStore<T>(store: Store<T>): T

/**
 * Subscribes a React component to a {@link Store} and returns a derived value
 * computed by the selector.
 *
 * The selector should return a referentially stable value (e.g. a primitive or
 * an existing object reference) to avoid unnecessary re-renders, since snapshots
 * are compared with `Object.is`.
 *
 * @param store - The store to subscribe to.
 * @param selector - A function that derives a value from the store state.
 * @returns The value returned by the selector.
 */
function useStore<T, U>(store: Store<T>, selector: Selector<T, U>): U

function useStore<T, U = T>(store: Store<T>, selector?: Selector<T, U>): T | U {
  const selectorRef = useRef<typeof selector>(undefined)
  selectorRef.current = selector

  const args = useMemo(() => {
    const subscribe = store.subscribe.bind(store)

    const getSnapshot = () =>
      selectorRef.current ? selectorRef.current(store.get()) : store.get()

    return { subscribe, getSnapshot }
  }, [store])

  const value = useSyncExternalStore(
    args.subscribe,
    args.getSnapshot,
    args.getSnapshot
  )

  useDebugValue(value)

  return value
}

export { useStore }
export type { Selector }
