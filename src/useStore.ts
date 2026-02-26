import { useDebugValue, useMemo, useSyncExternalStore } from 'react'
import type { Store } from './Store'

type Selector<T, U> = (state: T) => U

function useStore<T>(store: Store<T>): T
function useStore<T, U>(store: Store<T>, selector: Selector<T, U>): U
function useStore<T, U = T>(store: Store<T>, selector?: Selector<T, U>): T | U {
  const value = useSyncExternalStore(
    ...useMemo(() => {
      const getSnapshot = () => (selector ? selector(store.get()) : store.get())
      return [
        (onChange: () => void) => store.subscribe(onChange),
        getSnapshot,
        getSnapshot,
      ] satisfies Parameters<typeof useSyncExternalStore>
    }, [store, selector])
  )

  useDebugValue(value)

  return value
}

export { useStore }
