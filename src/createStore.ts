import { Store } from './Store'

function createStore<T>(state: T): Store<T>
function createStore<T = undefined>(): Store<T | undefined>
function createStore<T>(state?: T | undefined): Store<T | undefined> {
  return new Store(state)
}

export { createStore }
