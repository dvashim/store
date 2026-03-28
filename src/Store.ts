import type { SourceStore, Subscriber, UpdateOptions } from './types'

type Updater<T> = (prevValue: T) => T

/**
 * Reactive state container with subscription-based change notification.
 * @typeParam T - The type of the stored state.
 */
export class Store<T> implements SourceStore<T> {
  readonly #subscribers = new Set<Subscriber<T>>()
  #notifying = false
  #reentrantError: Error | null = null
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
  set(state: T, options?: UpdateOptions): void {
    this.#notify(state, options)
  }

  /**
   * Derives the next state via an updater function and notifies subscribers.
   * Re-entrant calls from within a subscriber throw an error.
   * @param updater - Receives the current state and returns the next state.
   * @param options - Pass `{ force: true }` to notify even when unchanged.
   */
  update(updater: Updater<T>, options?: UpdateOptions): void {
    this.#notify(updater(this.#state), options)
  }

  #notify(nextState: T, options?: UpdateOptions) {
    if (this.#notifying) {
      this.#reentrantError = new Error(
        'set() or update() cannot be called from within a subscriber'
      )

      throw this.#reentrantError
    }

    if (!options?.force && Object.is(nextState, this.#state)) {
      return
    }

    const prevState = this.#state
    this.#state = nextState

    if (this.#subscribers.size === 0) {
      return
    }

    this.#notifying = true

    try {
      for (const listener of [...this.#subscribers]) {
        try {
          listener(nextState, prevState)
        } catch (error) {
          if (error === this.#reentrantError) {
            throw error
          }
          console.error('Error in subscriber', error)
        }
      }
    } finally {
      this.#notifying = false
      this.#reentrantError = null
    }
  }
}
