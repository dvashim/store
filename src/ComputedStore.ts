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

// const s = new Store([1, 2])
// const len = new ComputedStore(s, (state) => state.length)
// const lenString = new ComputedStore(len, (state) => `length: ${state}`)
// const sum = new ComputedStore(s, (state) => state.reduce((a, b) => a + b, 0))
// console.log(len.get()) // 2
// console.log(sum.get()) // 3
// console.log(lenString.get()) // length: 2

// const len1 = new SubStore(s, (state) => state.length)
// const lenString1 = new SubStore(len1, (state) => `length: ${state}`)
// const sum1 = new SubStore(s, (state) => state.reduce((a, b) => a + b, 0))
// console.log(len1.get()) // 2
// console.log(sum1.get()) // 3
// console.log(lenString1.get()) // length: 2
