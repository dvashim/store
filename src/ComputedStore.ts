import { Store } from './Store'
import type { Selector, SourceStore, Subscriber } from './types'

export class ComputedStore<T, U> implements SourceStore<U> {
  readonly #source: SourceStore<T>
  readonly #derived: Store<U>
  readonly #selector: Selector<T, U>
  #unsubscribe?: (() => void) | undefined

  constructor(source: SourceStore<T>, selector: Selector<T, U>) {
    this.#source = source
    this.#derived = new Store(selector(source.get()))
    this.#selector = selector
    this.connect()
  }

  connect() {
    this.disconnect()
    this.#unsubscribe = this.#source.subscribe((state) => {
      this.#derived.set(this.#selector(state))
    })
  }

  disconnect() {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
  }

  get isConnected() {
    return !!this.#unsubscribe
  }

  protected get source() {
    return this.#source
  }

  protected get selector() {
    return this.#selector
  }

  get() {
    return this.#derived.get()
  }

  subscribe(fn: Subscriber<U>) {
    return this.#derived.subscribe(fn)
  }
}
