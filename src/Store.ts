type Subscriber = () => void
type Updater<T> = (prevValue: T) => T
type UpdateOptions = { force?: boolean }

export class Store<T> {
  readonly #subscribers = new Set<Subscriber>()
  #state: T

  constructor(initialState: T) {
    this.#state = initialState
  }

  get(): T {
    return this.#state
  }

  set(state: T, options?: UpdateOptions): boolean {
    return this.#notify(state, options)
  }

  update(updater: Updater<T>, options?: UpdateOptions): boolean {
    return this.#notify(updater(this.#state), options)
  }

  subscribe(fn: Subscriber): () => void {
    this.#subscribers.add(fn)
    return () => this.#subscribers.delete(fn)
  }

  /**
   * @returns `true` if listeners were notified
   */
  #notify(nextState: T, options?: UpdateOptions): boolean {
    if (!options?.force && Object.is(nextState, this.#state)) {
      return false
    }

    this.#state = nextState

    for (const listener of [...this.#subscribers]) {
      listener()
    }

    return true
  }
}
