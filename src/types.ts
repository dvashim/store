export type Selector<T, U> = (state: T) => U
export type Subscriber<T> = (state: T, prevState: T) => void
export type UpdateOptions = { force?: boolean }
export type SourceStore<T> = {
  get: () => T
  subscribe: (fn: Subscriber<T>) => () => void
}
