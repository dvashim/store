import {
  useCallback,
  useDebugValue,
  useSyncExternalStore,
} from 'react'
import type { Store } from './Store'

export const useStore = <T, U = T>(
  store: Store<T>,
  selector: (state: T) => U = (state) => state as unknown as U
) => {
  const value = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.state), [selector, store]),
    useCallback(() => selector(store.initialState), [selector, store])
  )

  useDebugValue(value)

  return value
}
