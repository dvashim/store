type Subscriber = () => void
type Updater<T> = (prevValue: T) => T
type UpdateOptions = { force?: boolean }
type QueueItem<T> = [updater: Updater<T>, options: UpdateOptions | undefined]

export class Store<T> {
  readonly #subscribers = new Set<Subscriber>()
  readonly #queue: QueueItem<T>[] = []
  #notifying = false
  #state: T

  constructor(initialState: T) {
    this.#state = initialState
  }

  subscribe(fn: Subscriber): () => void {
    this.#subscribers.add(fn)
    return () => this.#subscribers.delete(fn)
  }

  get(): T {
    return this.#state
  }

  set(state: T, options?: UpdateOptions) {
    return this.#run(() => state, options)
  }

  update(updater: Updater<T>, options?: UpdateOptions) {
    return this.#run(updater, options)
  }

  #run(updater: Updater<T>, options: UpdateOptions | undefined): void {
    this.#queue.push([updater, options])

    if (this.#notifying) {
      return
    }

    this.#notifying = true

    let queueItem = this.#queue.shift()

    while (queueItem) {
      const [queueUpdater, queueOptions] = queueItem
      this.#notify(queueUpdater(this.#state), queueOptions)
      queueItem = this.#queue.shift()
    }

    this.#notifying = false
  }

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
