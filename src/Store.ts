type Subscriber<T> = (state: T, prevState: T) => void
type Updater<T> = (prevValue: T) => T
type UpdateOptions = { force?: boolean }
type QueueItem<T> = {
  updater: Updater<T>
  options: UpdateOptions | undefined
}

const NO_ERROR = Symbol('no error')
const MAX_FLUSH_ITERATIONS = 100

/**
 * Reactive state container with subscription-based change notification.
 * @typeParam T - The type of the stored state.
 */
export class Store<T> {
  readonly #subscribers = new Set<Subscriber<T>>()
  readonly #queue: QueueItem<T>[] = []
  #notifying = false
  #state: T

  constructor(initialState: T) {
    this.#state = initialState
  }

  /**
   * Registers a subscriber that is called whenever the state changes.
   * @param fn - Callback invoked on each state change.
   * @returns An unsubscribe function that removes the subscriber.
   */
  subscribe(fn: Subscriber<T>): () => void {
    this.#subscribers.add(fn)
    return () => this.#subscribers.delete(fn)
  }

  /** Returns the current state. */
  get(): T {
    return this.#state
  }

  /**
   * Replaces the state and notifies subscribers.
   * Skipped if the value is identical (`Object.is`), unless `force` is set.
   * @param state - The new state value.
   * @param options - Pass `{ force: true }` to notify even when unchanged.
   */
  set(state: T, options?: UpdateOptions) {
    this.#queue.push({ updater: () => state, options })
    return this.#flush()
  }

  /**
   * Derives the next state via an updater function and notifies subscribers.
   * Re-entrant calls from within a subscriber are queued and flushed in FIFO order.
   * @param updater - Receives the current state and returns the next state.
   * @param options - Pass `{ force: true }` to notify even when unchanged.
   */
  update(updater: Updater<T>, options?: UpdateOptions) {
    this.#queue.push({ updater, options })
    return this.#flush()
  }

  #flush(): void {
    if (this.#notifying) {
      return
    }

    this.#notifying = true
    let iterations = 0
    let firstError: unknown = NO_ERROR

    try {
      let q = this.#queue.shift()
      while (q) {
        if (++iterations > MAX_FLUSH_ITERATIONS) {
          throw new Error(
            `Store: exceeded ${MAX_FLUSH_ITERATIONS} re-entrant updates. This likely indicates an infinite loop in a subscriber.`
          )
        }

        try {
          const state = q.updater(this.#state)
          this.#commit(state, q.options)
        } catch (error) {
          if (firstError === NO_ERROR) {
            firstError = error
          }
        }

        q = this.#queue.shift()
      }
    } catch (error) {
      this.#queue.length = 0
      throw error
    } finally {
      this.#notifying = false
    }

    if (firstError !== NO_ERROR) {
      throw firstError
    }
  }

  #commit(nextState: T, options?: UpdateOptions) {
    if (!options?.force && Object.is(nextState, this.#state)) {
      return
    }

    const prevState = this.#state
    this.#state = nextState

    for (const listener of [...this.#subscribers]) {
      try {
        listener(nextState, prevState)
      } catch (error) {
        console.error('Error in subscriber', error)
      }
    }
  }
}
