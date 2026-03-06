import { describe, expectTypeOf, it } from 'vitest'
import { Store } from '@/Store'
import type { Selector } from '@/useStore'
import { useStore } from '@/useStore'

describe('useStore types', () => {
  describe('without selector', () => {
    it('returns T when called with Store<T>', () => {
      const store = new Store(42)
      expectTypeOf(useStore(store)).toEqualTypeOf<number>()
    })

    it('returns string for Store<string>', () => {
      const store = new Store('hello')
      expectTypeOf(useStore(store)).toEqualTypeOf<string>()
    })

    it('returns union types correctly', () => {
      const store = new Store<string | null>(null)
      expectTypeOf(useStore(store)).toEqualTypeOf<string | null>()
    })

    it('returns object type', () => {
      const store = new Store({ count: 0, name: 'test' })
      expectTypeOf(useStore(store)).toEqualTypeOf<{
        count: number
        name: string
      }>()
    })

    it('returns undefined union when store state includes undefined', () => {
      const store = new Store<number | undefined>(undefined)
      expectTypeOf(useStore(store)).toEqualTypeOf<number | undefined>()
    })
  })

  describe('with selector', () => {
    it('infers U from the selector return type', () => {
      const store = new Store({ count: 0, label: 'hi' })
      expectTypeOf(useStore(store, (s) => s.count)).toEqualTypeOf<number>()
    })

    it('narrows to the selected field type', () => {
      const store = new Store({ active: true, items: [1, 2, 3] })
      expectTypeOf(useStore(store, (s) => s.items)).toEqualTypeOf<number[]>()
      expectTypeOf(useStore(store, (s) => s.active)).toEqualTypeOf<boolean>()
    })

    it('supports derived types different from state fields', () => {
      const store = new Store({ items: [1, 2, 3] })
      expectTypeOf(
        useStore(store, (s) => s.items.length)
      ).toEqualTypeOf<number>()
    })

    it('supports selectors returning a different type than T', () => {
      const store = new Store(42)
      expectTypeOf(useStore(store, (n) => String(n))).toEqualTypeOf<string>()
    })

    it('supports selectors returning union types', () => {
      const store = new Store({ value: 42 as number | null })
      expectTypeOf(useStore(store, (s) => s.value)).toEqualTypeOf<
        number | null
      >()
    })

    it('supports selectors returning tuples', () => {
      const store = new Store({ a: 1, b: 'hello' })
      expectTypeOf(
        useStore(store, (s) => [s.a, s.b] as [number, string])
      ).toEqualTypeOf<[number, string]>()
    })
  })

  describe('selector parameter type', () => {
    it('selector receives T as its parameter', () => {
      const store = new Store({ count: 0, name: 'test' })
      useStore(store, (s) => {
        expectTypeOf(s).toEqualTypeOf<{ count: number; name: string }>()
        return s.count
      })
    })

    // biome-ignore lint/nursery/useExpect: testing type error
    it('rejects selector with wrong parameter type', () => {
      const store = new Store(42)
      // @ts-expect-error — (s: string) => number is not assignable to Selector<number, number>
      useStore(store, (s: string) => s.length)
    })
  })

  describe('Selector type export', () => {
    it('Selector<T, U> matches (state: T) => U', () => {
      expectTypeOf<Selector<{ count: number }, number>>().toEqualTypeOf<
        (state: { count: number }) => number
      >()
    })

    it('can be used to type a selector variable', () => {
      const selector: Selector<{ count: number; name: string }, number> = (s) =>
        s.count
      const store = new Store({ count: 0, name: 'test' })
      expectTypeOf(useStore(store, selector)).toEqualTypeOf<number>()
    })
  })

  describe('overload discrimination', () => {
    // biome-ignore lint/nursery/useExpect: testing type error
    it('rejects equalityFn without selector (no such overload)', () => {
      const store = new Store(42)
      // @ts-expect-error — no overload accepts (store, equalityFn) without selector
      useStore(store, (a: number, b: number) => a === b)
    })

    // biome-ignore lint/nursery/useExpect: testing type error
    it('rejects extra arguments', () => {
      const store = new Store(42)
      // @ts-expect-error — expected 1-2 arguments, but got 3
      useStore(store, (s: number) => s, 'extra')
    })
  })
})
