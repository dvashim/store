import { describe, expectTypeOf, it } from 'vitest'
import { Store } from '@/Store'

describe('Store types', () => {
  describe('constructor', () => {
    it('infers T from the initial state', () => {
      const store = new Store(42)
      expectTypeOf(store).toEqualTypeOf<Store<number>>()
    })

    it('infers literal type with const assertion', () => {
      const store = new Store('hello' as const)
      expectTypeOf(store).toEqualTypeOf<Store<'hello'>>()
    })

    it('accepts explicit generic type', () => {
      const store = new Store<string | null>(null)
      expectTypeOf(store).toEqualTypeOf<Store<string | null>>()
    })

    it('rejects missing initial state', () => {
      // @ts-expect-error — expected 1 argument, but got 0
      // biome-ignore lint/nursery/noFloatingClasses: allowing instantiation of Store without args for testing type error
      new Store()
    })
  })

  describe('get', () => {
    it('returns T', () => {
      const store = new Store(42)
      expectTypeOf(store.get()).toEqualTypeOf<number>()
    })

    it('returns union types correctly', () => {
      const store = new Store<string | number>('hello')
      expectTypeOf(store.get()).toEqualTypeOf<string | number>()
    })

    it('returns T including undefined when T is a union with undefined', () => {
      const store = new Store<string | undefined>(undefined)
      expectTypeOf(store.get()).toEqualTypeOf<string | undefined>()
    })
  })

  describe('set', () => {
    it('accepts T as the state parameter', () => {
      const store = new Store(0)
      expectTypeOf(store.set).parameter(0).toEqualTypeOf<number>()
    })

    it('accepts options as the second parameter', () => {
      const store = new Store(0)
      expectTypeOf(store.set)
        .parameter(1)
        .toEqualTypeOf<{ force?: boolean } | undefined>()
    })

    it('returns void', () => {
      const store = new Store(0)
      expectTypeOf(store.set(1)).toEqualTypeOf<void>()
    })

    it('rejects wrong types', () => {
      const store = new Store(0)
      // @ts-expect-error — string is not assignable to number
      store.set('wrong')
    })
  })

  describe('update', () => {
    it('accepts an updater function (prevValue: T) => T', () => {
      const store = new Store(0)
      expectTypeOf(store.update)
        .parameter(0)
        .toEqualTypeOf<(prevValue: number) => number>()
    })

    it('returns void', () => {
      const store = new Store(0)
      expectTypeOf(store.update((v) => v + 1)).toEqualTypeOf<void>()
    })

    it('rejects updater returning wrong type', () => {
      const store = new Store(0)
      // @ts-expect-error — string is not assignable to number
      store.update(() => 'wrong')
    })

    it('rejects updater with wrong parameter type', () => {
      const store = new Store(0)
      // @ts-expect-error — (s: string) => number is not assignable to (prevValue: number) => number
      store.update((s: string) => s.length)
    })
  })

  describe('subscribe', () => {
    it('accepts a (state: T, prevState: T) => void callback', () => {
      const store = new Store(0)
      expectTypeOf(store.subscribe)
        .parameter(0)
        .toEqualTypeOf<(state: number, prevState: number) => void>()
    })

    it('accepts a () => void callback', () => {
      const store = new Store(0)
      store.subscribe(() => {})
    })

    it('accepts a callback using only state', () => {
      const store = new Store(0)
      store.subscribe((_state: number) => {})
    })

    it('returns an unsubscribe function () => void', () => {
      const store = new Store(0)
      const unsub = store.subscribe(() => {})
      expectTypeOf(unsub).toEqualTypeOf<() => void>()
    })

    it('rejects callbacks with wrong parameter types', () => {
      const store = new Store(0)
      // @ts-expect-error — (value: string) => void is not assignable to (state: number, prevState: number) => void
      store.subscribe((_value: string) => {})
    })
  })

  describe('complex types', () => {
    it('works with object types', () => {
      const store = new Store({ count: 0, name: 'test' })
      expectTypeOf(store.get()).toEqualTypeOf<{ name: string; count: number }>()
      expectTypeOf(store.set).parameter(0).toEqualTypeOf<{
        name: string
        count: number
      }>()
    })

    it('works with array types', () => {
      const store = new Store([1, 2, 3])
      expectTypeOf(store.get()).toEqualTypeOf<number[]>()
    })

    it('works with readonly types', () => {
      const store = new Store<readonly number[]>([1, 2, 3])
      expectTypeOf(store.get()).toEqualTypeOf<readonly number[]>()
    })

    it('works with tuple types', () => {
      const store = new Store<[string, number]>(['hello', 42])
      expectTypeOf(store.get()).toEqualTypeOf<[string, number]>()
    })

    it('works with function types as state', () => {
      const store = new Store<() => string>(() => 'hello')
      expectTypeOf(store.get()).toEqualTypeOf<() => string>()
    })
  })
})
