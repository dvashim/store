import { describe, expectTypeOf, it } from 'vitest'
import { createStore } from '@/createStore'
import type { Store } from '@/Store'

describe('createStore types', () => {
  it('infers Store<T> when state is provided', () => {
    const numStore = createStore(42)
    expectTypeOf(numStore).toEqualTypeOf<Store<number>>()
    expectTypeOf(numStore.get()).toEqualTypeOf<number>()

    const strStore = createStore('hello')
    expectTypeOf(strStore).toEqualTypeOf<Store<string>>()

    const objStore = createStore({ x: 1 })
    expectTypeOf(objStore).toEqualTypeOf<Store<{ x: number }>>()
  })

  it('returns Store<T | undefined> when no state is provided with explicit type', () => {
    const store = createStore<string>()
    expectTypeOf(store).toEqualTypeOf<Store<string | undefined>>()
    expectTypeOf(store.get()).toEqualTypeOf<string | undefined>()
  })

  it('returns Store<undefined> when called with no type arg and no state', () => {
    const store = createStore()
    expectTypeOf(store).toEqualTypeOf<Store<undefined>>()
    expectTypeOf(store.get()).toEqualTypeOf<undefined>()
  })

  it('infers literal types via const assertion', () => {
    const store = createStore('hello' as const)
    expectTypeOf(store).toEqualTypeOf<Store<'hello'>>()
  })

  it('preserves null in the type', () => {
    const store = createStore<string | null>(null)
    expectTypeOf(store).toEqualTypeOf<Store<string | null>>()
  })

  it('explicit undefined arg infers Store<undefined>', () => {
    const store = createStore(undefined)
    expectTypeOf(store).toEqualTypeOf<Store<undefined>>()
  })

  it('set() and update() accept the correct types', () => {
    const store = createStore(0)
    expectTypeOf(store.set).parameter(0).toEqualTypeOf<number>()
    expectTypeOf(store.update)
      .parameter(0)
      .toEqualTypeOf<(prevValue: number) => number>()

    const maybeStore = createStore<string>()
    expectTypeOf(maybeStore.set)
      .parameter(0)
      .toEqualTypeOf<string | undefined>()
  })

  // biome-ignore lint/nursery/useExpect: allowing @ts-expect-error for testing type errors
  it('rejects mismatched types at compile time', () => {
    const store = createStore(42)
    // @ts-expect-error — string is not assignable to number
    store.set('wrong')
    // @ts-expect-error — string is not assignable to number
    store.update(() => 'wrong')
  })
})
