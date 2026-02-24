import { Emitter } from './Emitter'

type Updater<T> = T | ((prevValue: T) => T)

export class Store<T> extends Emitter<T> {
  readonly #initialState: T
  #state: T

  constructor(initialState: T) {
    super()
    this.#state = initialState
    this.#initialState = initialState
  }

  get state() {
    return this.#state
  }

  get initialState() {
    return this.#initialState
  }

  setState(valueOrFn: Updater<T>, options?: { forceEmit?: boolean }) {
    const nextState =
      valueOrFn instanceof Function
        ? valueOrFn(this.#state)
        : valueOrFn

    if (!Object.is(nextState, this.#state) || options?.forceEmit) {
      const prevState = this.#state
      this.#state = nextState
      this.emit(nextState, prevState)
    }
  }
}
