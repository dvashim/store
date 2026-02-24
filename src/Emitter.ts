type Listener<T> = (value: T, prevValue: T) => void

export class Emitter<T> {
  readonly #listeners = new Set<Listener<T>>()

  subscribe = (listener: Listener<T>) => {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  emit(state: T, prevState: T) {
    for (const listener of this.#listeners) {
      listener(state, prevState)
    }
  }
}
